// File-Based CMS database for the Redesigned 14 DSA Topics
const DSA_TOPICS = {
  'arrays': {
    slug: 'arrays',
    name: 'Arrays',
    difficulty: 'Beginner',
    sequenceOrder: 1,
    understand: {
      explanation: 'An Array is a collection of elements stored in contiguous memory locations. Because it is contiguous, the computer can calculate the address of any element instantly using its index, giving fast lookup times.',
      analogy: 'Think of an Array as a train with numbered coaches. If you know the coach number (index), you can directly walk or jump to it without checking the other coaches.',
      visualExample: '[10] (Index 0) ── [20] (Index 1) ── [30] (Index 2) ── [40] (Index 3)'
    },
    visualize: {
      initialData: [10, 20, 30, 40]
    },
    patterns: [
      {
        name: 'Traversal',
        keywords: ['Find', 'Count', 'Maximum', 'Minimum', 'Sum'],
        questions: [
          { name: 'Find Maximum Element', leetcode: 'https://leetcode.com/problems/find-numbers-with-even-number-of-digits/' },
          { name: 'Array Sum', leetcode: 'https://leetcode.com/problems/running-sum-of-1d-array/' }
        ],
        recognition: 'Single linear scan from start to end (index 0 to n-1).'
      },
      {
        name: 'Two Pointer',
        keywords: ['Pair', 'Target Sum', 'Sorted Array', 'Reverse'],
        questions: [
          { name: 'Two Sum II', leetcode: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
          { name: 'Container With Most Water', leetcode: 'https://leetcode.com/problems/container-with-most-water/' }
        ],
        recognition: 'Looking for a pair or triplet in a sorted array. Pointers start at opposite boundaries (left & right) and move inwards.'
      },
      {
        name: 'Sliding Window',
        keywords: ['Subarray', 'Window', 'Maximum Sum', 'Consecutive'],
        questions: [
          { name: 'Maximum Sum Subarray of Size K', leetcode: 'https://leetcode.com/problems/maximum-subarray/' }
        ],
        recognition: 'Tracking a contiguous subsegment of elements. Window size either stays fixed (K) or grows/shrinks dynamically based on sums.'
      },
      {
        name: 'Prefix Sum',
        keywords: ['Range Sum', 'Cumulative Sum', 'Equilibrium'],
        questions: [
          { name: 'Range Sum Query', leetcode: 'https://leetcode.com/problems/range-sum-query-immutable/' }
        ],
        recognition: 'Performing multiple sum queries over array intervals without modifying elements. Preserves running sums.'
      }
    ],
    algorithms: [
      {
        name: 'Linear Search',
        useWhen: 'Unsorted array. Need to scan and find index of matching target element.',
        complexity: 'Time: O(n) | Space: O(1)'
      },
      {
        name: 'Binary Search',
        useWhen: 'Sorted array. Need to scan and locate matching target element by splitting search space.',
        complexity: 'Time: O(log n) | Space: O(1)'
      },
      {
        name: 'Kadane\'s Algorithm',
        useWhen: 'Finding the maximum contiguous subarray sum (drops prefix totals below zero).',
        complexity: 'Time: O(n) | Space: O(1)'
      },
      {
        name: 'Dutch National Flag',
        useWhen: 'Three distinct values (e.g. 0s, 1s, 2s) need to be sorted in-place (three pointers).',
        complexity: 'Time: O(n) | Space: O(1)'
      }
    ],
    questions: [
      {
        name: 'Two Sum II',
        leetcode: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
        pattern: 'Two Pointer',
        algorithm: 'Opposite Pointer Scanning',
        trace: 'Sorted input array. Start left=0, right=n-1. If sum < target, left++. If sum > target, right--. Return left+1, right+1 on match.',
        solution: `function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    let currentSum = numbers[left] + numbers[right];
    if (currentSum === target) return [left + 1, right + 1];
    if (currentSum < target) left++;
    else right--;
  }
  return [];
}`
      },
      {
        name: 'Maximum Subarray Sum',
        leetcode: 'https://leetcode.com/problems/maximum-subarray/',
        pattern: 'Sliding Window',
        algorithm: 'Kadane\'s Algorithm',
        trace: 'Maintain running maximum ending at current index. If current total drops below zero, reset start boundary to current element.',
        solution: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currentMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currentMax);
  }
  return maxSoFar;
}`
      }
    ],
    revise: {
      points: [
        'Contiguous layout enables index formula: Address = Base + i * W.',
        'Two Pointer optimizations cut nested iterations down from O(n^2) to O(n).',
        'Prefix Sum queries pre-calculate intervals to achieve O(1) reads.',
        'Kadane resets active sums when prefixes drop below zero.'
      ]
    }
  },
  'strings': {
    slug: 'strings',
    name: 'Strings',
    difficulty: 'Beginner',
    sequenceOrder: 2,
    understand: {
      explanation: 'A String is a sequence of characters stored in memory as an array of bytes or integers (ASCII/Unicode). Unlike arrays, strings often support concatenation, substring scanning, and matching operations.',
      analogy: 'Think of a String as a beaded necklace. Each bead is a letter, and the order of beads spells out a word. You can count, replace, or reverse beads.',
      visualExample: '["H"]["e"]["l"]["l"]["o"] (Length 5)'
    },
    visualize: {
      initialData: ['H', 'e', 'l', 'l', 'o']
    },
    patterns: [
      {
        name: 'Anagram Checking',
        keywords: ['Anagram', 'Permutation', 'Frequency Map'],
        questions: [
          { name: 'Valid Anagram', leetcode: 'https://leetcode.com/problems/valid-anagram/' }
        ],
        recognition: 'Check if two strings contain the same character sets with identical counts.'
      },
      {
        name: 'Palindrome Verification',
        keywords: ['Palindrome', 'Reverse', 'Symmetric'],
        questions: [
          { name: 'Valid Palindrome', leetcode: 'https://leetcode.com/problems/valid-palindrome/' }
        ],
        recognition: 'Compare characters from start and end moving inwards (Two Pointer overlap).'
      }
    ],
    algorithms: [
      {
        name: 'String Reversal',
        useWhen: 'Reversing string in-place (swap left and right characters).',
        complexity: 'Time: O(n) | Space: O(1)'
      },
      {
        name: 'Frequency Hash Counting',
        useWhen: 'Counting character occurrences (ASCII array of size 26 or 128).',
        complexity: 'Time: O(n) | Space: O(1) bounded character set size'
      }
    ],
    questions: [
      {
        name: 'Valid Palindrome',
        leetcode: 'https://leetcode.com/problems/valid-palindrome/',
        pattern: 'Two Pointer',
        algorithm: 'Inward Boundary Sweep',
        trace: 'Skip non-alphanumeric characters. Compare lowercased char at left and right pointers. Increment left, decrement right.',
        solution: `function isPalindrome(s) {
  let clean = s.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`
      }
    ],
    revise: {
      points: [
        'Strings behave like immutable arrays in languages like Java/JS (require copying to modify).',
        'Palindromes are verified using symmetric inward scans.',
        'ASCII operations use fixed arrays of size 256 for fast O(1) frequency mappings.'
      ]
    }
  },
  'binary-search': {
    slug: 'binary-search',
    name: 'Binary Search',
    difficulty: 'Easy',
    sequenceOrder: 3,
    understand: {
      explanation: 'Binary Search is an efficient interval division algorithm used to find the position of a target value within a sorted array. It repeatedly halves the search space.',
      analogy: 'Think of finding a name in a physical phonebook. You open to the middle. If the name is alphabetically earlier, you discard the right half and open to the middle of the left half.',
      visualExample: '[10][20][30][40][50] (Search space halved each step)'
    },
    visualize: {
      initialData: [10, 20, 30, 40, 50]
    },
    patterns: [
      {
        name: 'Boundary Scan',
        keywords: ['Sorted', 'Target', 'Floor', 'Ceiling'],
        questions: [
          { name: 'Find First and Last Position', leetcode: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/' }
        ],
        recognition: 'Array is sorted, and you need to locate target or boundary offsets.'
      }
    ],
    algorithms: [
      {
        name: 'Interval Division',
        useWhen: 'Array is sorted. Compute mid = low + (high - low)/2. Adjust low/high borders based on mid comparison.',
        complexity: 'Time: O(log n) | Space: O(1)'
      }
    ],
    questions: [
      {
        name: 'Standard Binary Search',
        leetcode: 'https://leetcode.com/problems/binary-search/',
        pattern: 'Boundary Scan',
        algorithm: 'Interval Division',
        trace: 'Maintain low and high limits. Halve limits by comparing middle cell value against search target.',
        solution: `function search(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`
      }
    ],
    revise: {
      points: [
        'Requires sorted arrays. Cuts search space in half with every iteration.',
        'Prevents arithmetic overflows by using mid = low + (high-low)/2 instead of (low+high)/2.',
        'Runs in logarithmic runtime complexity: O(log n).'
      ]
    }
  },
  'sorting': {
    slug: 'sorting',
    name: 'Sorting',
    difficulty: 'Easy',
    sequenceOrder: 4,
    understand: {
      explanation: 'Sorting rearranges array elements in ascending or descending sequence. Master sorting to prepare for binary search and greedy optimizations.',
      analogy: 'Think of arranging a hand of playing cards from smallest to largest. You pull cards one-by-one and place them in their correct slots.',
      visualExample: '[40][10][30][20] ──Sorted──> [10][20][30][40]'
    },
    visualize: {
      initialData: [40, 10, 30, 20]
    },
    patterns: [
      {
        name: 'Divide and Conquer',
        keywords: ['Merge', 'Pivot', 'Fast Sorting'],
        questions: [
          { name: 'Sort an Array', leetcode: 'https://leetcode.com/problems/sort-an-array/' }
        ],
        recognition: 'Large dataset sorting requiring O(n log n) efficiency bounds.'
      }
    ],
    algorithms: [
      {
        name: 'Bubble Sort',
        useWhen: 'Small arrays. Swaps adjacent cells if out of order.',
        complexity: 'Time: O(n^2) | Space: O(1)'
      },
      {
        name: 'Merge Sort',
        useWhen: 'Stable sorting required. Divides array into halves, sorts halves, and merges them.',
        complexity: 'Time: O(n log n) | Space: O(n)'
      }
    ],
    questions: [
      {
        name: 'Merge Sort',
        leetcode: 'https://leetcode.com/problems/sort-an-array/',
        pattern: 'Divide and Conquer',
        algorithm: 'Merge Sort Recursion',
        trace: 'Recursively split array in half. Sort sub-segments. Merge sorted sub-segments into a consolidated output.',
        solution: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  let mid = Math.floor(arr.length / 2);
  let left = mergeSort(arr.slice(0, mid));
  let right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(left, right) {
  let res = [], i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) res.push(left[i++]);
    else res.push(right[j++]);
  }
  return [...res, ...left.slice(i), ...right.slice(j)];
}`
      }
    ],
    revise: {
      points: [
        'Bubble/Selection/Insertion sorting scale poorly at O(n^2) complexities.',
        'Merge/Quick/Heap sorting scale efficiently at O(n log n) bounds.',
        'Stable sorts preserve order of duplicate items (like Merge Sort).'
      ]
    }
  },
  'recursion': {
    slug: 'recursion',
    name: 'Recursion',
    difficulty: 'Medium',
    sequenceOrder: 5,
    understand: {
      explanation: 'Recursion is a programming technique where a function calls itself to solve smaller subproblems of the same problem. Requires a base case to prevent stack overflows.',
      analogy: 'Think of nested Russian dolls. Opening a doll reveals a smaller doll, until you reach the smallest solid doll (base case) which cannot be opened.',
      visualExample: 'fact(3) = 3 * fact(2) -> fact(2) = 2 * fact(1) -> fact(1) = 1'
    },
    visualize: {
      initialData: [3, 2, 1]
    },
    patterns: [
      {
        name: 'Divide and Conquer',
        keywords: ['Base Case', 'Subproblem', 'Backtrack'],
        questions: [
          { name: 'Fibonacci Number', leetcode: 'https://leetcode.com/problems/fibonacci-number/' }
        ],
        recognition: 'The problem can be solved by combining solutions of identical smaller subproblems.'
      }
    ],
    algorithms: [
      {
        name: 'Recursion Base Stack',
        useWhen: 'Recursive state resolution. Always define a terminating boundary checks first.',
        complexity: 'Time: O(2^n) standard Fibonacci | Space: O(n) depth'
      }
    ],
    questions: [
      {
        name: 'Fibonacci Number',
        leetcode: 'https://leetcode.com/problems/fibonacci-number/',
        pattern: 'Divide and Conquer',
        algorithm: 'Recursion Base Stack',
        trace: 'Solve fib(n) = fib(n-1) + fib(n-2). Base cases are n=0 and n=1.',
        solution: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}`
      }
    ],
    revise: {
      points: [
        'Every recursion must define a Base Case to end function calls.',
        'Recursion uses the call stack, which can lead to Stack Overflow if depth exceeds limits.',
        'Memoization caches solutions to optimize redundant branches.'
      ]
    }
  },
  'linked-list': {
    slug: 'linked-list',
    name: 'Linked List',
    difficulty: 'Medium',
    sequenceOrder: 6,
    understand: {
      explanation: 'A Linked List is a linear data structure where elements are not stored contiguously in memory. Instead, each element (node) contains a data field and a pointer (reference) pointing to the next node.',
      analogy: 'Think of a scavenger hunt. You go to a location. At that location, you find a clue that tells you the address of the next location. You keep going until you find a clue pointing to nothing.',
      visualExample: '[Data: 10 | Next] ──> [Data: 20 | Next] ──> NULL'
    },
    visualize: {
      initialData: [10, 20, 30]
    },
    patterns: [
      {
        name: 'Pointer Redirection',
        keywords: ['Reverse', 'Cycle', 'Slow & Fast', 'Middle'],
        questions: [
          { name: 'Reverse Linked List', leetcode: 'https://leetcode.com/problems/reverse-linked-list/' },
          { name: 'Linked List Cycle', leetcode: 'https://leetcode.com/problems/linked-list-cycle/' }
        ],
        recognition: 'Modifying pointers to reverse direction, merge paths, or check for loops.'
      }
    ],
    algorithms: [
      {
        name: 'Floyd\'s Cycle Finding',
        useWhen: 'Determining if a loop exists in list nodes (Slow pointer moves 1 step, Fast pointer moves 2).',
        complexity: 'Time: O(n) | Space: O(1)'
      },
      {
        name: 'Pointer Shifting',
        useWhen: 'Reversing list links by shifting prev, curr, and next references.',
        complexity: 'Time: O(n) | Space: O(1)'
      }
    ],
    questions: [
      {
        name: 'Reverse Linked List',
        leetcode: 'https://leetcode.com/problems/reverse-linked-list/',
        pattern: 'Pointer Redirection',
        algorithm: 'Pointer Shifting',
        trace: 'Maintain prev=null, curr=head. In a loop, save next = curr.next. Redirect curr.next = prev. Shift prev = curr, curr = next.',
        solution: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }
  return prev;
}`
      }
    ],
    revise: {
      points: [
        'Nodes are allocated dynamically anywhere in memory, linked via references.',
        'Index lookup requires scanning nodes sequentially: O(n) time.',
        'Inserting or deleting nodes at the front runs in O(1) time.'
      ]
    }
  },
  'stack': {
    slug: 'stack',
    name: 'Stack',
    difficulty: 'Medium',
    sequenceOrder: 7,
    understand: {
      explanation: 'A Stack is a linear data structure that follows the Last In, First Out (LIFO) access rule. Elements are added and removed from the same end (called the top).',
      analogy: 'Think of a stack of dinner plates in a cabinet. You place new plates on top, and you must remove plates from the top first. To get the bottom plate, you must remove all plates above it.',
      visualExample: '[30] (Top) \n [20] \n [10] (Bottom)'
    },
    visualize: {
      initialData: [10, 20, 30]
    },
    patterns: [
      {
        name: 'Nested Validations',
        keywords: ['Parentheses', 'Monotonic Stack', 'Reverse Order'],
        questions: [
          { name: 'Valid Parentheses', leetcode: 'https://leetcode.com/problems/valid-parentheses/' }
        ],
        recognition: 'Evaluating nested matching pairs (like parentheses) or retrieving items in reverse sequence.'
      }
    ],
    algorithms: [
      {
        name: 'LIFO Execution Stack',
        useWhen: 'Adding elements using push() and removing using pop() on top references.',
        complexity: 'Time: O(1) operations | Space: O(n)'
      }
    ],
    questions: [
      {
        name: 'Valid Parentheses',
        leetcode: 'https://leetcode.com/problems/valid-parentheses/',
        pattern: 'Nested Validations',
        algorithm: 'LIFO Execution Stack',
        trace: 'Iterate characters. Push open brackets to stack. For closing brackets, pop stack top. Verify matching pair.',
        solution: `function isValid(s) {
  let stack = [];
  let map = { ")": "(", "}": "{", "]": "[" };
  for (let char of s) {
    if (char === "(" || char === "{" || char === "[") {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`
      }
    ],
    revise: {
      points: [
        'LIFO rule: Last In, First Out.',
        'Used in call stack tracking, expression parsing, and undo/redo operations.',
        'All primary operations (push, pop, peek) execute in O(1) time.'
      ]
    }
  },
  'queue': {
    slug: 'queue',
    name: 'Queue',
    difficulty: 'Medium',
    sequenceOrder: 8,
    understand: {
      explanation: 'A Queue is a linear data structure that follows the First In, First Out (FIFO) access rule. Elements are added at the back (enqueue) and removed from the front (dequeue).',
      analogy: 'Think of a queue of customers waiting at a checkout counter. The first customer who joins the line is served first, and new customers join at the back of the line.',
      visualExample: '[Front: 10] <── [20] <── [Back: 30]'
    },
    visualize: {
      initialData: [10, 20, 30]
    },
    patterns: [
      {
        name: 'Level-Order Traversal',
        keywords: ['BFS', 'Level order', 'First-come'],
        questions: [
          { name: 'Implement Queue using Stacks', leetcode: 'https://leetcode.com/problems/implement-queue-using-stacks/' }
        ],
        recognition: 'Processing items in order of arrival, or performing level-by-level traversal (BFS) in trees and graphs.'
      }
    ],
    algorithms: [
      {
        name: 'FIFO Buffer Pipeline',
        useWhen: 'Inserting at rear pointer and removing from front pointer.',
        complexity: 'Time: O(1) operations | Space: O(n)'
      }
    ],
    questions: [
      {
        name: 'Queue with Stacks',
        leetcode: 'https://leetcode.com/problems/implement-queue-using-stacks/',
        pattern: 'Level-Order Traversal',
        algorithm: 'FIFO Buffer Pipeline',
        trace: 'Use two stacks. Push elements into stack1. To pop, transfer elements to stack2 to invert order, then pop.',
        solution: `class MyQueue {
  constructor() {
    this.s1 = [];
    this.s2 = [];
  }
  push(x) { this.s1.push(x); }
  pop() {
    if (this.s2.length === 0) {
      while(this.s1.length > 0) this.s2.push(this.s1.pop());
    }
    return this.s2.pop();
  }
  peek() {
    if (this.s2.length === 0) {
      while(this.s1.length > 0) this.s2.push(this.s1.pop());
    }
    return this.s2[this.s2.length - 1];
  }
}`
      }
    ],
    revise: {
      points: [
        'FIFO rule: First In, First Out.',
        'Used in scheduling queues, buffer structures, and Breadth-First Searches.',
        'Basic operations (enqueue, dequeue) run in O(1) time.'
      ]
    }
  },
  'trees': {
    slug: 'trees',
    name: 'Trees',
    difficulty: 'Hard',
    sequenceOrder: 9,
    understand: {
      explanation: 'A Tree is a hierarchical non-linear data structure consisting of nodes connected by edges. The top node is called the root, and each node has zero or more child nodes.',
      analogy: 'Think of an organizational hierarchy chart. The CEO is at the root. The CEO has Vice Presidents (children), who in turn manage Directors (grandchildren).',
      visualExample: '      [Root]\n      /    \\\n   [Left] [Right]'
    },
    visualize: {
      initialData: [1, 2, 3]
    },
    patterns: [
      {
        name: 'Depth Traversal',
        keywords: ['Pre-order', 'In-order', 'Post-order', 'DFS'],
        questions: [
          { name: 'Maximum Depth of Binary Tree', leetcode: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' }
        ],
        recognition: 'Traversing deep down tree branches recursively using DFS.'
      }
    ],
    algorithms: [
      {
        name: 'Recursive Depth Scanning',
        useWhen: 'Traversing subtree nodes using recursion, tracking maximum heights.',
        complexity: 'Time: O(n) | Space: O(h) recursion depth'
      }
    ],
    questions: [
      {
        name: 'Maximum Depth of Binary Tree',
        leetcode: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
        pattern: 'Depth Traversal',
        algorithm: 'Recursive Depth Scanning',
        trace: 'Depth is 1 + max(depth(left), depth(right)). Base case: null node returns 0.',
        solution: `function maxDepth(root) {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`
      }
    ],
    revise: {
      points: [
        'Hierarchical layout. A binary tree restricts nodes to maximum 2 child connections.',
        'DFS traversals: Pre-order (DLR), In-order (LDR), and Post-order (LRD).',
        'Time complexity for full scans scales linearly at O(n).'
      ]
    }
  },
  'bst': {
    slug: 'bst',
    name: 'Binary Search Tree',
    difficulty: 'Hard',
    sequenceOrder: 10,
    understand: {
      explanation: 'A Binary Search Tree (BST) is a binary tree with a sorting property: for any node, all left subtree values are smaller, and all right subtree values are larger.',
      analogy: 'Think of an organized catalog filing system. A central folder contains alphabetical markers. Items beginning with letters A-M go left; N-Z go right.',
      visualExample: '       [20]\n      /    \\\n    [10]   [30]'
    },
    visualize: {
      initialData: [20, 10, 30]
    },
    patterns: [
      {
        name: 'BST Divide & Conquer',
        keywords: ['BST Search', 'Insert BST', 'Range Sum BST'],
        questions: [
          { name: 'Search in a Binary Search Tree', leetcode: 'https://leetcode.com/problems/search-in-a-binary-search-tree/' }
        ],
        recognition: 'Target node search. Halve search tree space by comparing node values.'
      }
    ],
    algorithms: [
      {
        name: 'BST Target Split Search',
        useWhen: 'Sorted tree. Jump to left or right subtree based on value comparisons.',
        complexity: 'Time: O(log n) balanced | Space: O(h)'
      }
    ],
    questions: [
      {
        name: 'Search BST',
        leetcode: 'https://leetcode.com/problems/search-in-a-binary-search-tree/',
        pattern: 'BST Divide & Conquer',
        algorithm: 'BST Target Split Search',
        trace: 'If root is null or root.val === val, return root. If val < root.val, search left. Else, search right.',
        solution: `function searchBST(root, val) {
  if (root === null || root.val === val) return root;
  return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);
}`
      }
    ],
    revise: {
      points: [
        'Left values < Root < Right values.',
        'In-order traversal of a BST outputs elements in sorted ascending order.',
        'Search/Insert operations run in logarithmic O(log n) average time.'
      ]
    }
  },
  'heap': {
    slug: 'heap',
    name: 'Heap / Priority Queue',
    difficulty: 'Hard',
    sequenceOrder: 11,
    understand: {
      explanation: 'A Heap is a complete binary tree where parent nodes maintain a size relationship with their children. A Max-Heap ensures parents are larger than children; a Min-Heap keeps parents smaller.',
      analogy: 'Think of a triage room in a hospital. Patient treatment order is determined by severity (priority) rather than simple arrival times.',
      visualExample: '       [50] (Max element at root)\n      /    \\\n    [30]   [40]'
    },
    visualize: {
      initialData: [50, 30, 40]
    },
    patterns: [
      {
        name: 'Dynamic Extremum Extraction',
        keywords: ['Kth Largest', 'Merge Sorted Lists', 'Priority'],
        questions: [
          { name: 'Kth Largest Element in an Array', leetcode: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' }
        ],
        recognition: 'Regularly query or retrieve the minimum or maximum element in a changing data collection.'
      }
    ],
    algorithms: [
      {
        name: 'Heapify Shift Up/Down',
        useWhen: 'Maintaining heap structures after inserting or removing the root element.',
        complexity: 'Time: O(log n) operation | Space: O(1)'
      }
    ],
    questions: [
      {
        name: 'Kth Largest Element',
        leetcode: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
        pattern: 'Dynamic Extremum Extraction',
        algorithm: 'Min-Heap Bounded Insertions',
        trace: 'Maintain a min-heap of size K. Discard smaller values. Root is the Kth largest element.',
        solution: `// Using a JavaScript sorting fallback for in-place array scans
function findKthLargest(nums, k) {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}`
      }
    ],
    revise: {
      points: [
        'Complete binary tree structure mapped inside flat contiguous arrays.',
        'Max element (Max-Heap) or Min element (Min-Heap) is always at index 0.',
        'Inserting or extracting elements runs in O(log n) time.'
      ]
    }
  },
  'hashing': {
    slug: 'hashing',
    name: 'Hashing',
    difficulty: 'Medium',
    sequenceOrder: 12,
    understand: {
      explanation: 'Hashing maps keys to specific index offsets using a hash function, allowing O(1) average time search, insertion, and deletion operations.',
      analogy: 'Think of a school student locker system. Each locker key is uniquely mapped to a locker number. You can open your locker directly without checking other lockers.',
      visualExample: 'Key: "Amit" ──Hash Function──> Index: 3 ──> Value: "Locker 3 Data"'
    },
    visualize: {
      initialData: [null, null, 'Amit', null]
    },
    patterns: [
      {
        name: 'Frequency Mapping',
        keywords: ['Frequency', 'Lookup', 'Exists', 'Unique'],
        questions: [
          { name: 'Contains Duplicate', leetcode: 'https://leetcode.com/problems/contains-duplicate/' }
        ],
        recognition: 'Retrieving elements, counting occurrences, or checking existence in O(1) time.'
      }
    ],
    algorithms: [
      {
        name: 'Hash Key Lookups',
        useWhen: 'Mapping keys to values or set collections.',
        complexity: 'Time: O(1) average | Space: O(n)'
      }
    ],
    questions: [
      {
        name: 'Contains Duplicate',
        leetcode: 'https://leetcode.com/problems/contains-duplicate/',
        pattern: 'Frequency Mapping',
        algorithm: 'Hash Key Lookups',
        trace: 'Use a Set. For each element, check if it already exists. If yes, duplicate found. Else, add to set.',
        solution: `function containsDuplicate(nums) {
  let seen = new Set();
  for (let num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}`
      }
    ],
    revise: {
      points: [
        'Key-value lookup using hash calculations.',
        'Allows O(1) average time lookups, insertions, and deletions.',
        'Handle index collisions using chaining (linked lists) or open addressing.'
      ]
    }
  },
  'graphs': {
    slug: 'graphs',
    name: 'Graphs',
    difficulty: 'Hard',
    sequenceOrder: 13,
    understand: {
      explanation: 'A Graph is a non-linear data structure consisting of nodes (vertices) connected by edges. Graphs can model complex networks, maps, and dependencies.',
      analogy: 'Think of a social network like Facebook. People are nodes (vertices), and friendships are edges connecting them. Edges can be bidirectional (friendships) or directional (Instagram followers).',
      visualExample: '[Node A] ──(Edge)──> [Node B] ──> [Node C]'
    },
    visualize: {
      initialData: [1, 2, 3]
    },
    patterns: [
      {
        name: 'Network Traversal',
        keywords: ['BFS', 'DFS', 'Islands', 'Cycle'],
        questions: [
          { name: 'Number of Islands', leetcode: 'https://leetcode.com/problems/number-of-islands/' }
        ],
        recognition: 'Traversing paths, counting connected components, or finding shortest routes.'
      }
    ],
    algorithms: [
      {
        name: 'Breadth-First Search (BFS)',
        useWhen: 'Finding shortest path in unweighted graphs level-by-level.',
        complexity: 'Time: O(V + E) | Space: O(V)'
      },
      {
        name: 'Depth-First Search (DFS)',
        useWhen: 'Traversing deep along paths to check connectivity or detect cycles.',
        complexity: 'Time: O(V + E) | Space: O(V)'
      }
    ],
    questions: [
      {
        name: 'Number of Islands',
        leetcode: 'https://leetcode.com/problems/number-of-islands/',
        pattern: 'Network Traversal',
        algorithm: 'DFS Flood Fill',
        trace: 'Scan grid cells. For every land cell ("1"), increment island count and run DFS to sink all connected land cells to water ("0").',
        solution: `function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === "1") {
        count++;
        dfs(grid, r, c);
      }
    }
  }
  return count;
}
function dfs(grid, r, c) {
  if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === "0") return;
  grid[r][c] = "0"; // Sink land cell
  dfs(grid, r + 1, c);
  dfs(grid, r - 1, c);
  dfs(grid, r, c + 1);
  dfs(grid, r, c - 1);
}`
      }
    ],
    revise: {
      points: [
        'Nodes (vertices) linked by edges (directed/undirected, weighted/unweighted).',
        'BFS uses queues for shortest paths; DFS uses recursion/stack for connectivity.',
        'Graph representations: Adjacency List (space-efficient) or Adjacency Matrix.'
      ]
    }
  },
  'dynamic-programming': {
    slug: 'dynamic-programming',
    name: 'Dynamic Programming',
    difficulty: 'Hard',
    sequenceOrder: 14,
    understand: {
      explanation: 'Dynamic Programming (DP) optimizes recursive algorithms by breaking down problems into overlapping subproblems, solving them once, and caching their results.',
      analogy: 'Think of writing down the sum of 1+1+1+1+1 on a sheet of paper. It equals 5. If we add another "+1" at the end, you don\'t recalculate from start; you remember 5, add 1, and write 6.',
      visualExample: 'fib(4) = fib(3) + fib(2) -> Cached values avoid duplicate calculations.'
    },
    visualize: {
      initialData: [1, 1, 2, 3, 5]
    },
    patterns: [
      {
        name: 'Memoized Recursion',
        keywords: ['Ways', 'Minimum Cost', 'Maximize', 'LCS'],
        questions: [
          { name: 'Climbing Stairs', leetcode: 'https://leetcode.com/problems/climbing-stairs/' }
        ],
        recognition: 'The problem requires finding the maximum/minimum/total combinations of steps to achieve a goal, with overlapping subproblems.'
      }
    ],
    algorithms: [
      {
        name: 'Memoization (Top-Down)',
        useWhen: 'Recursive strategy with a lookup cache to prevent redundant branch calls.',
        complexity: 'Time: O(n) | Space: O(n)'
      },
      {
        name: 'Tabulation (Bottom-Up)',
        useWhen: 'Iterative table filling from base state to final target index.',
        complexity: 'Time: O(n) | Space: O(n) or O(1)'
      }
    ],
    questions: [
      {
        name: 'Climbing Stairs',
        leetcode: 'https://leetcode.com/problems/climbing-stairs/',
        pattern: 'Memoized Recursion',
        algorithm: 'Tabulation (Bottom-Up)',
        trace: 'Ways to reach step i is dp[i] = dp[i-1] + dp[i-2]. Can optimize space to O(1) variables.',
        solution: `function climbStairs(n) {
  if (n <= 2) return n;
  let first = 1, second = 2;
  for (let i = 3; i <= n; i++) {
    let third = first + second;
    first = second;
    second = third;
  }
  return second;
}`
      }
    ],
    revise: {
      points: [
        'Solves complex problems by caching overlapping subproblem results.',
        'Top-Down (Memoization + Recursion) vs. Bottom-Up (Tabulation + Iteration).',
        'Core properties: Overlapping Subproblems and Optimal Substructure.'
      ]
    }
  }
};

module.exports = {
  DSA_TOPICS
};
