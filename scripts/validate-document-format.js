#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

class DocumentValidator {
  constructor(policyId, layer) {
    this.policyId = policyId;
    this.layer = layer;
    this.results = { passed: [], failed: [], warnings: [] };
  }

  loadDocumentGuide() {
    const layerMap = { contextual: 1, conceptual: 2, logical: 3, physical: 4, component: 5, operational: 6 };
    const layerNum = layerMap[this.layer];
    const guidePath = path.join(__dirname, '..', 'config', 'document-guides', `layer-${layerNum}-${this.layer}-guide.json`);
    if (!fs.existsSync(guidePath)) throw new Error(`Document guide not found: ${guidePath}`);
    return JSON.parse(fs.readFileSync(guidePath, 'utf8'));
  }

  loadSections() {
    const sectionsPath = path.join(__dirname, '..', 'policies', this.policyId, this.layer, 'sections.json');
    if (!fs.existsSync(sectionsPath)) throw new Error(`Sections file not found: ${sectionsPath}`);
    return JSON.parse(fs.readFileSync(sectionsPath, 'utf8'));
  }

  validateStructure(guide, sections) {
    console.log(`\n${colors.blue}=== Structure Validation ===${colors.reset}`);
    const requiredSections = guide.validation.structure.requiredSections;
    const generatedSections = Object.keys(sections.sections);

    requiredSections.forEach(sectionId => {
      if (generatedSections.includes(sectionId)) {
        this.results.passed.push(`✓ Section ${sectionId} present`);
      } else {
        this.results.failed.push(`✗ Section ${sectionId} MISSING`);
      }
    });

    if (guide.validation.structure.sectionOrder === 'sequential') {
      let isSequential = true;
      let lastIndex = -1;
      for (const sectionId of generatedSections) {
        const currentIndex = requiredSections.indexOf(sectionId);
        if (currentIndex !== -1) {
          if (currentIndex < lastIndex) {
            isSequential = false;
            break;
          }
          lastIndex = currentIndex;
        }
      }
      if (isSequential) {
        this.results.passed.push(`✓ Sections in sequential order`);
      } else {
        this.results.warnings.push(`⚠ Sections not in sequential order`);
      }
    }
  }

  countWords(content) {
    const text = content
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .trim();
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  validateContent(guide, sections) {
    console.log(`\n${colors.blue}=== Content Validation ===${colors.reset}`);
    guide.validation.content.checks.forEach(check => {
      if (check.type === 'wordCount') {
        Object.entries(sections.sections).forEach(entry => {
          const sectionId = entry[0];
          const section = entry[1];
          if (!section.content) {
            this.results.failed.push(`✗ Section ${sectionId}: No content`);
            return;
          }
          const wordCount = this.countWords(section.content);
          if (wordCount >= check.min && wordCount <= check.max) {
            this.results.passed.push(`✓ Section ${sectionId}: ${wordCount} words (within ${check.min}-${check.max})`);
          } else if (wordCount < check.min) {
            this.results.failed.push(`✗ Section ${sectionId}: ${wordCount} words (below minimum ${check.min})`);
          } else {
            this.results.warnings.push(`⚠ Section ${sectionId}: ${wordCount} words (exceeds maximum ${check.max})`);
          }
        });
      } else if (check.type === 'traceability') {
        const traceabilityPath = path.join(__dirname, '..', 'policies', this.policyId, this.layer, 'traceability.json');
        if (!fs.existsSync(traceabilityPath)) {
          this.results.failed.push(`✗ Traceability file not found`);
        } else {
          const traceability = JSON.parse(fs.readFileSync(traceabilityPath, 'utf8'));
          Object.entries(sections.sections).forEach(entry => {
            const sectionId = entry[0];
            const references = traceability.references[sectionId] || [];
            if (references.length >= check.minReferences) {
              this.results.passed.push(`✓ Section ${sectionId}: ${references.length} traceability reference(s)`);
            } else {
              this.results.failed.push(`✗ Section ${sectionId}: Only ${references.length} traceability reference(s) (minimum ${check.minReferences})`);
            }
          });
        }
      } else if (check.type === 'framework') {
        const frameworkPatterns = [
          new RegExp('NIST\\s+(?:CSF|SP|Privacy|RMF)\\s+[\\w\\-\\.]+', 'gi'),
          new RegExp('ISO\\s+\\d+\\s+(?:Clause|A\\.|Annex)\\s*[\\d\\.]+', 'gi'),
          new RegExp('GDPR\\s+Article\\s+\\d+', 'gi'),
          new RegExp('PCI\\s+DSS\\s+[\\d\\.]+', 'gi'),
          new RegExp('SOC\\s+2', 'gi'),
          new RegExp('CIS\\s+Control[s]?\\s+[\\d\\.]+', 'gi'),
          new RegExp('FIPS\\s+\\d+-\\d+', 'gi')
        ];
        Object.entries(sections.sections).forEach(entry => {
          const sectionId = entry[0];
          const section = entry[1];
          const combinedText = (section.content || '') + ' ' + (section.rationale_why || '');
          let citationCount = 0;
          frameworkPatterns.forEach(pattern => {
            const matches = combinedText.match(pattern);
            if (matches) citationCount += matches.length;
          });
          if (citationCount >= check.minCitations) {
            this.results.passed.push(`✓ Section ${sectionId}: ${citationCount} framework citation(s)`);
          } else {
            this.results.failed.push(`✗ Section ${sectionId}: Only ${citationCount} framework citation(s) (minimum ${check.minCitations})`);
          }
        });
      }
    });
  }

  validateRationale(guide, sections) {
    console.log(`\n${colors.blue}=== Rationale Validation ===${colors.reset}`);
    const rationaleReq = guide.validation.rationale;
    Object.entries(sections.sections).forEach(entry => {
      const sectionId = entry[0];
      const section = entry[1];
      if (!rationaleReq.required) {
        this.results.passed.push(`✓ Section ${sectionId}: Rationale not required`);
        return;
      }
      if (!section.rationale_why || !section.rationale_condition) {
        this.results.failed.push(`✗ Section ${sectionId}: Missing rationale fields`);
        return;
      }
      const rationaleLength = section.rationale_why.length + section.rationale_condition.length;
      if (rationaleLength >= rationaleReq.minLength) {
        this.results.passed.push(`✓ Section ${sectionId}: Rationale present (${rationaleLength} chars)`);
      } else {
        this.results.failed.push(`✗ Section ${sectionId}: Rationale too short (${rationaleLength} chars, minimum ${rationaleReq.minLength})`);
      }
    });
  }

  generateReport() {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`${colors.blue}VALIDATION REPORT${colors.reset}`);
    console.log(`Policy: ${this.policyId} | Layer: ${this.layer}`);
    console.log(`${'='.repeat(80)}`);

    if (this.results.passed.length > 0) {
      console.log(`\n${colors.green}Passed (${this.results.passed.length})${colors.reset}`);
      this.results.passed.forEach(msg => console.log(`  ${colors.green}${msg}${colors.reset}`));
    }

    if (this.results.warnings.length > 0) {
      console.log(`\n${colors.yellow}Warnings (${this.results.warnings.length})${colors.reset}`);
      this.results.warnings.forEach(msg => console.log(`  ${colors.yellow}${msg}${colors.reset}`));
    }

    if (this.results.failed.length > 0) {
      console.log(`\n${colors.red}Failed (${this.results.failed.length})${colors.reset}`);
      this.results.failed.forEach(msg => console.log(`  ${colors.red}${msg}${colors.reset}`));
    }

    console.log(`\n${'='.repeat(80)}`);
    console.log(`${colors.blue}SUMMARY${colors.reset}`);
    console.log(`Total Checks: ${this.results.passed.length + this.results.warnings.length + this.results.failed.length}`);
    console.log(`${colors.green}✓ Passed: ${this.results.passed.length}${colors.reset}`);
    console.log(`${colors.yellow}⚠ Warnings: ${this.results.warnings.length}${colors.reset}`);
    console.log(`${colors.red}✗ Failed: ${this.results.failed.length}${colors.reset}`);
    console.log(`${'='.repeat(80)}\n`);

    return this.results.failed.length === 0 ? 0 : 1;
  }

  validate() {
    try {
      console.log(`\n${colors.blue}Loading document guide and sections...${colors.reset}`);
      const guide = this.loadDocumentGuide();
      const sections = this.loadSections();
      this.validateStructure(guide, sections);
      this.validateContent(guide, sections);
      this.validateRationale(guide, sections);
      return this.generateReport();
    } catch (error) {
      console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
      return 1;
    }
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.error(`${colors.red}Usage: node validate-document-format.js <policy-id> <layer>${colors.reset}`);
    console.error(`${colors.gray}Example: node validate-document-format.js POL-2025-004 contextual${colors.reset}`);
    process.exit(1);
  }
  const [policyId, layer] = args;
  const validator = new DocumentValidator(policyId, layer);
  const exitCode = validator.validate();
  process.exit(exitCode);
}

module.exports = DocumentValidator;
