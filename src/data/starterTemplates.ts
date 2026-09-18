// src/data/starterTemplates.ts
import type { SupportedLanguage } from '../components/practice/CodeEditorPanel';

export const BASE_STARTER_TEMPLATES: Record<SupportedLanguage, string> = {
  java: `// Low-Level Design Implementation (Java 17)
// Design clean domain classes, interfaces, and methods for this system.

import java.util.*;

public class Solution {
    // Write your object-oriented design and classes here
}`,
  typescript: `// Low-Level Design Implementation (TypeScript 5)
// Design clean domain classes, interfaces, and methods for this system.

export class Solution {
  // Write your object-oriented design and classes here
}`,
  python: `# Low-Level Design Implementation (Python 3.11)
# Design clean domain classes, interfaces, and methods for this system.

class Solution:
    # Write your object-oriented design and classes here
    pass`,
  cpp: `// Low-Level Design Implementation (C++ 20)
// Design clean domain classes, interfaces, and methods for this system.

#include <iostream>

class Solution {
public:
    // Write your object-oriented design and classes here
};`,
  go: `// Low-Level Design Implementation (Go 1.22)
// Design clean domain classes, interfaces, and methods for this system.

package main

// Write your object-oriented design and structs here`,
};

export function getStarterTemplate(_slug: string, lang: SupportedLanguage): string {
  return BASE_STARTER_TEMPLATES[lang] || BASE_STARTER_TEMPLATES.java;
}
