import { TreeNode, ParsedIdeas } from '@/types/brainstorm';

export function parseBulletPoints(content: string): string[] {
  if (!content) return [];

  // Split the content into lines
  const lines = content.split('\n');
  const bulletPoints: string[] = [];

  // Iterate over each line
  for (const line of lines) {
    // Strip leading and trailing whitespace
    const stripped = line.trim();

    // Check if the line starts with a bullet point indicator
    if (stripped.startsWith('- ')) {
      // Remove the bullet point indicator and any leading/trailing whitespace
      const bulletPoint = stripped.substring(2).trim();
      if (bulletPoint) {
        bulletPoints.push(bulletPoint);
      }
    } else if (stripped.startsWith('-')) {
      // Handle cases where there's no space after the bullet point indicator
      const bulletPoint = stripped.substring(1).trim();
      if (bulletPoint) {
        bulletPoints.push(bulletPoint);
      }
    } else if (stripped && bulletPoints.length > 0) {
      // Handle lines that are part of a bullet point but don't start with '-'
      // Append this line to the last bullet point, adding a space
      bulletPoints[bulletPoints.length - 1] += ' ' + stripped;
    }
  }

  return bulletPoints;
}

export function createTreeNode(
  rootContent: string,
  ideas: string[],
  method: string,
  level: number = 0,
  parentId?: string
): TreeNode {
  const nodeId = generateNodeId();
  
  const node: TreeNode = {
    id: nodeId,
    content: rootContent,
    level,
    parentId,
    children: [],
    methodUsed: method,
    timestamp: new Date(),
  };

  // Create child nodes for each idea
  ideas.forEach((idea, index) => {
    const childNode: TreeNode = {
      id: generateNodeId(),
      content: idea,
      level: level + 1,
      parentId: nodeId,
      children: [],
      methodUsed: method,
      timestamp: new Date(),
    };
    
    node.children.push(childNode);
  });

  return node;
}

export function addChildToTree(
  tree: TreeNode,
  parentId: string,
  newIdeas: string[],
  method: string
): TreeNode {
  // Find the parent node
  const parentNode = findNodeById(tree, parentId);
  if (!parentNode) {
    throw new Error(`Parent node with id ${parentId} not found`);
  }

  // Add new child nodes
  newIdeas.forEach(idea => {
    const childNode: TreeNode = {
      id: generateNodeId(),
      content: idea,
      level: parentNode.level + 1,
      parentId: parentNode.id,
      children: [],
      methodUsed: method,
      timestamp: new Date(),
    };
    
    parentNode.children.push(childNode);
  });

  return tree;
}

export function findNodeById(tree: TreeNode, nodeId: string): TreeNode | null {
  if (tree.id === nodeId) {
    return tree;
  }

  for (const child of tree.children) {
    const found = findNodeById(child, nodeId);
    if (found) {
      return found;
    }
  }

  return null;
}

export function flattenTree(tree: TreeNode): TreeNode[] {
  const result: TreeNode[] = [tree];
  
  for (const child of tree.children) {
    result.push(...flattenTree(child));
  }
  
  return result;
}

export function getTreeDepth(tree: TreeNode): number {
  if (tree.children.length === 0) {
    return 1;
  }
  
  const childDepths = tree.children.map(child => getTreeDepth(child));
  return 1 + Math.max(...childDepths);
}

export function getNodeCount(tree: TreeNode): number {
  return 1 + tree.children.reduce((count, child) => count + getNodeCount(child), 0);
}

export function exportTreeAsMarkdown(tree: TreeNode, indent: number = 0): string {
  const indentStr = '  '.repeat(indent);
  let result = `${indentStr}- ${tree.content}\n`;
  
  for (const child of tree.children) {
    result += exportTreeAsMarkdown(child, indent + 1);
  }
  
  return result;
}

export function exportTreeAsJSON(tree: TreeNode): string {
  return JSON.stringify(tree, null, 2);
}

export function parseIdeasByMethod(content: string, method: string): ParsedIdeas {
  const ideas = parseBulletPoints(content);
  
  // Method-specific parsing logic
  switch (method) {
    case 'role-storming':
      return parseRoleStormingIdeas(content, ideas);
    case 'scamper':
      return parseSCAMPERIdeas(content, ideas);
    case 'six-thinking-hats':
      return parseSixHatsIdeas(content, ideas);
    case 'starbursting':
      return parseStarburstingIdeas(content, ideas);
    default:
      return {
        ideas,
        rawResponse: content,
        method,
      };
  }
}

function parseRoleStormingIdeas(content: string, ideas: string[]): ParsedIdeas {
  // Extract role-specific ideas
  const roleIdeas = ideas.filter(idea => idea.includes('[') && idea.includes(']:'));
  
  return {
    ideas: roleIdeas.length > 0 ? roleIdeas : ideas,
    rawResponse: content,
    method: 'role-storming',
  };
}

function parseSCAMPERIdeas(content: string, ideas: string[]): ParsedIdeas {
  // Extract SCAMPER technique ideas
  const scamperIdeas = ideas.filter(idea => 
    /^(SUBSTITUTE|COMBINE|ADAPT|MODIFY|MAGNIFY|PUT TO OTHER USES|ELIMINATE|REVERSE|REARRANGE):/i.test(idea)
  );
  
  return {
    ideas: scamperIdeas.length > 0 ? scamperIdeas : ideas,
    rawResponse: content,
    method: 'scamper',
  };
}

function parseSixHatsIdeas(content: string, ideas: string[]): ParsedIdeas {
  // Extract Six Hats ideas
  const hatIdeas = ideas.filter(idea => 
    /^(WHITE|RED|BLACK|YELLOW|GREEN|BLUE) HAT:/i.test(idea)
  );
  
  return {
    ideas: hatIdeas.length > 0 ? hatIdeas : ideas,
    rawResponse: content,
    method: 'six-thinking-hats',
  };
}

function parseStarburstingIdeas(content: string, ideas: string[]): ParsedIdeas {
  // Extract Starbursting questions
  const questionIdeas = ideas.filter(idea => 
    /^(WHO|WHAT|WHERE|WHEN|WHY|HOW):/i.test(idea)
  );
  
  return {
    ideas: questionIdeas.length > 0 ? questionIdeas : ideas,
    rawResponse: content,
    method: 'starbursting',
  };
}

function generateNodeId(): string {
  return `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateTreeStructure(tree: TreeNode): boolean {
  // Check if all children have correct parent references
  for (const child of tree.children) {
    if (child.parentId !== tree.id) {
      return false;
    }
    
    if (child.level !== tree.level + 1) {
      return false;
    }
    
    if (!validateTreeStructure(child)) {
      return false;
    }
  }
  
  return true;
}