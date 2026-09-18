/**
 * codeEvaluator.js
 * Automated testing & grading engine for Web Development & Programming assignments (HTML / CSS / JavaScript).
 */

export const DEFAULT_LOGIN_FORM_RULES = [
  {
    id: "rule-form",
    label: "Contains <form> element",
    type: "selector",
    selector: "form",
    marks: 4,
    hint: "Use a <form> tag to wrap your login inputs."
  },
  {
    id: "rule-username",
    label: "Username or Email input with placeholder",
    type: "selector_attr",
    selector: 'input[type="text"], input[type="email"]',
    attr: "placeholder",
    marks: 4,
    hint: 'Add an <input type="text" placeholder="Username..."> for the username or email.'
  },
  {
    id: "rule-password",
    label: "Password input field (<input type=\"password\">)",
    type: "selector",
    selector: 'input[type="password"]',
    marks: 4,
    hint: 'Add an <input type="password" placeholder="Password..."> for security.'
  },
  {
    id: "rule-submit",
    label: "Submit button (<button> or <input type=\"submit\">)",
    type: "selector",
    selector: 'button, input[type="submit"]',
    marks: 4,
    hint: 'Add a <button type="submit">Login</button> to submit the form.'
  },
  {
    id: "rule-css",
    label: "CSS styling applied (background, padding, or border-radius)",
    type: "css_pattern",
    pattern: "background|border-radius|padding|box-shadow|display\\s*:\\s*flex",
    marks: 4,
    hint: "Add CSS styling to customize your form colors, padding, or rounded corners."
  }
];

export const DEFAULT_CARD_UI_RULES = [
  {
    id: "rule-container",
    label: "Card container element",
    type: "selector",
    selector: ".card, .container, .profile-card, article, section",
    marks: 5,
    hint: "Create a container with class card or <article> tag."
  },
  {
    id: "rule-heading",
    label: "Title / Heading (<h1> to <h4>)",
    type: "selector",
    selector: "h1, h2, h3, h4",
    marks: 5,
    hint: "Include a heading tag with the card title or name."
  },
  {
    id: "rule-paragraph",
    label: "Description or body text (<p>)",
    type: "selector",
    selector: "p",
    marks: 5,
    hint: "Add a paragraph describing the card content."
  },
  {
    id: "rule-card-css",
    label: "Card styling (border, border-radius or shadow)",
    type: "css_pattern",
    pattern: "border-radius|box-shadow|border\\s*:",
    marks: 5,
    hint: "Give your card rounded borders or a subtle box-shadow in CSS."
  }
];

export const evaluateWebCode = (code = {}, rules = []) => {
  const html = typeof code === "string" ? code : (code?.html || "");
  const css = code?.css || "";
  const js = code?.js || "";

  const activeRules = Array.isArray(rules) && rules.length > 0 ? rules : DEFAULT_LOGIN_FORM_RULES;

  let doc = null;
  try {
    const parser = new DOMParser();
    doc = parser.parseFromString(html, "text/html");
  } catch (err) {
    console.error("DOMParser error:", err);
  }

  let totalScore = 0;
  let maxMarks = 0;

  const results = activeRules.map((rule, idx) => {
    const ruleMarks = Number(rule.marks) || 5;
    maxMarks += ruleMarks;
    let passed = false;
    let message = "";

    try {
      if (rule.type === "selector") {
        if (doc) {
          const el = doc.querySelector(rule.selector);
          passed = Boolean(el);
          message = passed
            ? `Found matching element for '${rule.selector}'`
            : `Missing element matching '${rule.selector}'`;
        }
      } else if (rule.type === "selector_attr") {
        if (doc) {
          const els = doc.querySelectorAll(rule.selector);
          for (const el of els) {
            if (el.hasAttribute(rule.attr) && el.getAttribute(rule.attr)?.trim().length > 0) {
              passed = true;
              break;
            }
          }
          message = passed
            ? `Found '${rule.selector}' with attribute '${rule.attr}'`
            : `Missing '${rule.selector}' with attribute '${rule.attr}'`;
        }
      } else if (rule.type === "text_contains") {
        const text = doc?.body?.textContent?.toLowerCase() || "";
        passed = text.includes((rule.text || "").toLowerCase());
        message = passed ? `Found text '${rule.text}'` : `Missing text '${rule.text}'`;
      } else if (rule.type === "css_pattern") {
        const pattern = new RegExp(rule.pattern || "background", "i");
        passed = pattern.test(css) || pattern.test(html);
        message = passed
          ? "CSS styling criteria detected"
          : "Required CSS properties not found";
      } else if (rule.type === "css_selector") {
        const pattern = new RegExp(`${rule.cssSelector || ""}\\s*\\{`, "i");
        passed = pattern.test(css) || pattern.test(html);
        message = passed ? `Found CSS rule for '${rule.cssSelector}'` : `Missing CSS rule for '${rule.cssSelector}'`;
      } else if (rule.type === "js_pattern") {
        const pattern = new RegExp(rule.pattern || "function", "i");
        passed = pattern.test(js) || pattern.test(html);
        message = passed ? "JavaScript requirement satisfied" : "Required JavaScript logic not detected";
      } else {
        const selector = rule.selector || rule.query;
        if (selector && doc) {
          passed = Boolean(doc.querySelector(selector));
          message = passed ? `Criteria satisfied: ${selector}` : `Element not found: ${selector}`;
        }
      }
    } catch (e) {
      passed = false;
      message = `Test check error: ${e.message}`;
    }

    if (passed) {
      totalScore += ruleMarks;
    }

    return {
      id: rule.id || `rule-${idx}`,
      label: rule.label || `Requirement ${idx + 1}`,
      passed,
      marks: passed ? ruleMarks : 0,
      maxMarks: ruleMarks,
      message,
      hint: rule.hint || ""
    };
  });

  const percentage = maxMarks > 0 ? Math.round((totalScore / maxMarks) * 100) : 0;

  return {
    score: totalScore,
    maxMarks,
    percentage,
    results
  };
};

export const buildPreviewDocument = (html = "", css = "", js = "") => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #ffffff;
      color: #0f172a;
    }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    try {
      ${js}
    } catch (err) {
      console.warn("Script execution warning:", err);
    }
  </script>
</body>
</html>`;
};
