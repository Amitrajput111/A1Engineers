'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { apiClient } from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '../../../components/ui/Card';
import { 
  ChevronLeft, 
  ChevronDown,
  BookOpen, 
  Compass, 
  HelpCircle, 
  Award,
  CheckCircle,
  Copy,
  Check,
  Zap,
  Target,
  Clock,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Eye,
  AlertCircle,
  Layers,
  TrendingUp,
  Coins,
  Play,
  Download,
  Terminal,
  Brain
} from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

interface PatternQuestion {
  name: string;
  leetcode: string;
}

interface PatternItem {
  name: string;
  keywords: string[];
  questions: PatternQuestion[];
  recognition: string;
}

interface AlgorithmItem {
  name: string;
  useWhen: string;
  complexity: string;
}

interface ChallengeQuestion {
  name: string;
  leetcode: string;
  pattern: string;
  algorithm: string;
  trace: string;
  solution: string;
}

interface DsaTopicData {
  slug: string;
  name: string;
  difficulty: string;
  sequenceOrder: number;
  understand: {
    explanation: string;
    analogy: string;
    visualExample: string;
  };
  visualize: {
    initialData: any[];
  };
  patterns: PatternItem[];
  algorithms: AlgorithmItem[];
  questions: ChallengeQuestion[];
  revise: {
    points: string[];
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function DsaTopicPage({ params }: PageProps) {
  const router = useRouter();
  const { user, setUser, isAuthenticated, isLoading } = useAuthStore();
  
  // Unwrap params
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [topic, setTopic] = useState<DsaTopicData | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [activeTab, setActiveTab] = useState<string>('understand');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // AI State Wrappers
  const [simplifying, setSimplifying] = useState(false);
  const [simplerExplanation, setSimplerExplanation] = useState<string | null>(null);
  
  const [generatingAnalogy, setGeneratingAnalogy] = useState(false);
  const [customAnalogy, setCustomAnalogy] = useState<string | null>(null);

  const [quizzing, setQuizzing] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);

  // Custom Arrays Module States
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedLang, setSelectedLang] = useState<'cpp' | 'java' | 'python'>('cpp');
  const [fundCodeLang, setFundCodeLang] = useState<'cpp' | 'java' | 'python' | 'js'>('cpp');
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [activePatternIndex, setActivePatternIndex] = useState(0);
  const [activeAlgIndex, setActiveAlgIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedApproach, setSelectedApproach] = useState<'brute' | 'optimal'>('brute');
  const [activePatternProblemIndex, setActivePatternProblemIndex] = useState(0);
  const [activeAlgProblemIndex, setActiveAlgProblemIndex] = useState(0);
  const [isSlideBarOpen, setIsSlideBarOpen] = useState(true);
  const [activeProblemSlide, setActiveProblemSlide] = useState(0);
  const [isCodeExpanded, setIsCodeExpanded] = useState(true);
  const [isStrategyExpanded, setIsStrategyExpanded] = useState(true);
  const [isDryRunExpanded, setIsDryRunExpanded] = useState(true);
  const [activeSweepIdx, setActiveSweepIdx] = useState<number | null>(null);
  const [isSweepTracing, setIsSweepTracing] = useState(false);
  const [sweepProblemTitle, setSweepProblemTitle] = useState('');

  // Toggle states for Fundamentals & Visualize collapsible panels
  const [isWhatIsArrayExpanded, setIsWhatIsArrayExpanded] = useState(true);
  const [isWhyArrayExpanded, setIsWhyArrayExpanded] = useState(true);
  const [isCreatingExpanded, setIsCreatingExpanded] = useState(true);
  const [isCharacteristicsExpanded, setIsCharacteristicsExpanded] = useState(true);
  const [isWhenToUseExpanded, setIsWhenToUseExpanded] = useState(true);
  const [isPlaygroundExpanded, setIsPlaygroundExpanded] = useState(true);
  const [isSandboxExpanded, setIsSandboxExpanded] = useState(true);


  const patternsData = [
    {
      name: 'Traversal Sweep',
      desc: 'Traversal means visiting every element of an array one by one from start to end (or end to start). This is the most basic building block of array operations, used to search, count, or process elements.',
      problems: [
        {
          title: 'Find Maximum Element',
          leetcode: 'https://leetcode.com/problems/find-numbers-with-even-number-of-digits/',
          gfg: 'https://www.geeksforgeeks.org/problems/find-minimum-and-maximum-element-in-an-array4101/1',
          questionExplain: 'Given an unsorted array of integers, find the largest element.\\n\\nInput: nums = [12, 35, 1, 10, 34]\\nOutput: 35\\n\\nConstraints:\\n- 1 <= nums.length <= 10^5\\n- -10^9 <= nums[i] <= 10^9',
          bruteExplain: 'Sort the array in ascending order. The maximum element will be located at the last index (N-1).',
          bruteComplexity: 'Time Complexity: O(N log N) | Space Complexity: O(1) (in-place sort)',
          brutePseudocode: 'Step 1: Sort the array in ascending order using standard library sort.\\nStep 2: Access and return the element at index size - 1.',
          bruteOutput: 'Input: nums = [12, 35, 1, 10, 34]\\nOutput: 35',
          bruteCpp: `#include <vector>
#include <algorithm>

int findMax(std::vector<int>& nums) {
    // Sort elements in ascending order
    std::sort(nums.begin(), nums.end());
    
    // Return last element which is the maximum
    return nums[nums.size() - 1];
}`,
          bruteJava: `import java.util.Arrays;

public class Solution {
    public int findMax(int[] nums) {
        // Sort elements in ascending order
        Arrays.sort(nums);
        
        // Return last element which is the maximum
        return nums[nums.length - 1];
    }
}`,
          brutePython: `def findMax(nums: list[int]) -> int:
    # Sort elements in ascending order
    nums.sort()
    
    # Return last element which is the maximum
    return nums[-1]`,
          bruteCodeExplain: '1. We call standard sort to arrange the array elements from smallest to largest.\\n2. After sorting, the maximum element is guaranteed to reside at the final index (N-1).\\n3. We access and return the last item. This runs in O(N log N) time.',
          optimalExplain: 'Scan the array in a single pass while maintaining a running maximum tracker variable initialized to the first element.',
          optimalComplexity: 'Time Complexity: O(N) | Space Complexity: O(1)',
          optimalPseudocode: 'Step 1: Initialize maxVal = nums[0].\\nStep 2: Iterate index i from 1 to N-1. If nums[i] > maxVal, update maxVal = nums[i].\\nStep 3: Return maxVal.',
          optimalOutput: 'Input: nums = [12, 35, 1, 10, 34]\\nOutput: 35',
          optimalCpp: `#include <vector>
#include <algorithm>

int findMax(std::vector<int>& nums) {
    // Initialize maxVal with the first element
    int maxVal = nums[0];
    
    // Iterate from the second element to the end
    for (size_t i = 1; i < nums.size(); i++) {
        // Update maxVal if current element is larger
        if (nums[i] > maxVal) {
            maxVal = nums[i];
        }
    }
    return maxVal;
}`,
          optimalJava: `public class Solution {
    public int findMax(int[] nums) {
        // Initialize maxVal with the first element
        int maxVal = nums[0];
        
        // Iterate from the second element to the end
        for (int i = 1; i < nums.length; i++) {
            // Update maxVal if current element is larger
            if (nums[i] > maxVal) {
                maxVal = nums[i];
            }
        }
        return maxVal;
    }
}`,
          optimalPython: `def findMax(nums: list[int]) -> int:
    # Initialize maxVal with the first element
    max_val = nums[0]
    
    # Iterate from the second element to the end
    for i in range(1, len(nums)):
        # Update max_val if current element is larger
        if nums[i] > max_val:
            max_val = nums[i]
            
    return max_val`,
          optimalCodeExplain: '1. Initialize our candidate tracker `maxVal` to `nums[0]`.\\n2. Loop through indices `1` to `N-1` to inspect every other element sequentially.\\n3. If any element `nums[i]` is strictly larger than `maxVal`, we update `maxVal` with `nums[i]`.\\n4. Return `maxVal`. This scans elements exactly once in O(N) time.'
        },
        {
          title: 'Find Minimum Element',
          leetcode: 'https://leetcode.com/problems/find-numbers-with-even-number-of-digits/',
          gfg: 'https://www.geeksforgeeks.org/problems/find-minimum-and-maximum-element-in-an-array4101/1',
          questionExplain: 'Given an unsorted array of integers, find the smallest element.\\n\\nInput: nums = [12, 35, 1, 10, 34]\\nOutput: 1\\n\\nConstraints:\\n- 1 <= nums.length <= 10^5\\n- -10^9 <= nums[i] <= 10^9',
          bruteExplain: 'Sort the array in ascending order. The minimum element will be located at the first index (index 0).',
          bruteComplexity: 'Time Complexity: O(N log N) | Space Complexity: O(1) (in-place sort)',
          brutePseudocode: 'Step 1: Sort the array in ascending order using standard library sort.\\nStep 2: Return the element located at index 0.',
          bruteOutput: 'Input: nums = [12, 35, 1, 10, 34]\\nOutput: 1',
          bruteCpp: `#include <vector>
#include <algorithm>

int findMin(std::vector<int>& nums) {
    // Sort elements in ascending order
    std::sort(nums.begin(), nums.end());
    
    // Return first element which is the minimum
    return nums[0];
}`,
          bruteJava: `import java.util.Arrays;

public class Solution {
    public int findMin(int[] nums) {
        // Sort elements in ascending order
        Arrays.sort(nums);
        
        // Return first element which is the minimum
        return nums[0];
    }
}`,
          brutePython: `def findMin(nums: list[int]) -> int:
    # Sort elements in ascending order
    nums.sort()
    
    # Return first element which is the minimum
    return nums[0]`,
          bruteCodeExplain: '1. Sort the input array sequentially from smallest to largest.\\n2. Access the smallest value directly at index 0.\\n3. This resolves the question in O(N log N) time.',
          optimalExplain: 'Scan the array in a single pass while maintaining a running minimum tracker variable initialized to the first element.',
          optimalComplexity: 'Time Complexity: O(N) | Space Complexity: O(1)',
          optimalPseudocode: 'Step 1: Initialize minVal = nums[0].\\nStep 2: Iterate index i from 1 to N-1. If nums[i] < minVal, update minVal = nums[i].\\nStep 3: Return minVal.',
          optimalOutput: 'Input: nums = [12, 35, 1, 10, 34]\\nOutput: 1',
          optimalCpp: `#include <vector>
#include <algorithm>

int findMin(std::vector<int>& nums) {
    // Initialize minVal with the first element
    int minVal = nums[0];
    
    // Scan all remaining elements in a single sweep
    for (size_t i = 1; i < nums.size(); i++) {
        // Update minVal if current element is smaller
        if (nums[i] < minVal) {
            minVal = nums[i];
        }
    }
    return minVal;
}`,
          optimalJava: `public class Solution {
    public int findMin(int[] nums) {
        // Initialize minVal with the first element
        int minVal = nums[0];
        
        // Scan all remaining elements in a single sweep
        for (int i = 1; i < nums.length; i++) {
            // Update minVal if current element is smaller
            if (nums[i] < minVal) {
                minVal = nums[i];
            }
        }
        return minVal;
    }
}`,
          optimalPython: `def findMin(nums: list[int]) -> int:
    # Initialize minVal with the first element
    min_val = nums[0]
    
    # Scan all remaining elements in a single sweep
    for i in range(1, len(nums)):
        # Update min_val if current element is smaller
        if nums[i] < min_val:
            min_val = nums[i]
            
    return min_val`,
          optimalCodeExplain: '1. Place our runner min tracker `minVal` at index 0.\\n2. Traverse the list from index 1 to the end.\\n3. Compare each element to `minVal`, and if it is smaller, update `minVal`.\\n4. This guarantees a single linear scan of O(N) time with O(1) extra space.'
        }
      ]
    },
    {
      name: 'Two Pointers',
      desc: 'Using two references starting at boundaries (often Left = 0, Right = n-1) moving inwards to locate pair items matching a constraint in O(n) time.',
      problems: [
        {
          title: 'Two Sum II - Input Array Is Sorted',
          leetcode: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
          gfg: 'https://www.geeksforgeeks.org/problems/pair-in-array-whose-sum-is-closest-to-x1124/1',
          questionExplain: 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.\\n\\nInput: numbers = [2, 7, 11, 15], target = 9\\nOutput: [1, 2]\\n\\nConstraints:\\n- 2 <= numbers.length <= 3 * 10^4\\n- -1000 <= numbers[i] <= 1000\\n- numbers is sorted in non-decreasing order.\\n- The tests are generated such that there is exactly one solution.',
          bruteExplain: 'Use nested loops to check the sum of every possible pair of elements. If numbers[i] + numbers[j] equals target, return their 1-based indices.',
          bruteComplexity: 'Time Complexity: O(N²) | Space Complexity: O(1)',
          brutePseudocode: 'Step 1: Loop i from 0 to N-1.\\nStep 2: Loop j from i+1 to N-1.\\nStep 3: If numbers[i] + numbers[j] == target, return [i+1, j+1].\\nStep 4: Return empty array if no match is found.',
          bruteOutput: 'Input: numbers = [2, 7, 11, 15], target = 9\\nOutput: [1, 2]',
          bruteCpp: `#include <vector>

std::vector<int> twoSum(std::vector<int>& numbers, int target) {
    int n = numbers.size();
    // Outer loop selects the first element
    for (int i = 0; i < n; i++) {
        // Inner loop searches all subsequent elements
        for (int j = i + 1; j < n; j++) {
            // Check if pair sums up to target
            if (numbers[i] + numbers[j] == target) {
                return {i + 1, j + 1}; // Return 1-based indices
            }
        }
    }
    return {};
}`,
          bruteJava: `public class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int n = numbers.length;
        // Outer loop selects the first element
        for (int i = 0; i < n; i++) {
            // Inner loop searches all subsequent elements
            for (int j = i + 1; j < n; j++) {
                // Check if pair sums up to target
                if (numbers[i] + numbers[j] == target) {
                    return new int[]{i + 1, j + 1}; // Return 1-based indices
                }
            }
        }
        return new int[0];
    }
}`,
          brutePython: `def twoSum(numbers: list[int], target: int) -> list[int]:
    n = len(numbers)
    # Outer loop selects the first element
    for i in range(n):
        # Inner loop searches all subsequent elements
        for j in range(i + 1, n):
            # Check if pair sums up to target
            if numbers[i] + numbers[j] == target:
                return [i + 1, j + 1] # Return 1-based indices
                
    return []`,
          bruteCodeExplain: '1. Run nested loops to pair every index `i` with every subsequent index `j`.\\n2. Add their values together and compare against the target value.\\n3. Returns the 1-indexed pair `[i+1, j+1]` immediately when target matches. Time complexity is O(N²).',
          optimalExplain: 'Place two pointers: Left pointer at index 0 and Right pointer at index N-1. Calculate the sum of the elements at these pointers. If sum equals target, return their indices. If sum is smaller than target, increment Left. If sum is larger, decrement Right. This narrows the bounds linearly.',
          optimalComplexity: 'Time Complexity: O(N) | Space Complexity: O(1)',
          optimalPseudocode: 'Step 1: Set left = 0, right = N-1.\\nStep 2: While left < right:\\n  Calculate currentSum = numbers[left] + numbers[right].\\n  If currentSum == target, return [left+1, right+1].\\n  If currentSum < target, increment left.\\n  If currentSum > target, decrement right.\\nStep 3: Return empty bounds.',
          optimalOutput: 'Input: numbers = [2, 7, 11, 15], target = 9\\nOutput: [1, 2]',
          optimalCpp: `#include <vector>

std::vector<int> twoSum(std::vector<int>& numbers, int target) {
    int left = 0;
    int right = numbers.size() - 1;
    
    // Move pointers inwards until they cross
    while (left < right) {
        int currentSum = numbers[left] + numbers[right];
        
        // Target found; return 1-based indices
        if (currentSum == target) {
            return {left + 1, right + 1};
        }
        
        // Sum is too small; move left pointer right to increase sum
        if (currentSum < target) {
            left++;
        } 
        // Sum is too large; move right pointer left to decrease sum
        else {
            right--;
        }
    }
    return {};
}`,
          optimalJava: `public class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0;
        int right = numbers.length - 1;
        
        // Move pointers inwards until they cross
        while (left < right) {
            int currentSum = numbers[left] + numbers[right];
            
            // Target found; return 1-based indices
            if (currentSum == target) {
                return new int[]{left + 1, right + 1};
            }
            
            // Sum is too small; move left pointer right to increase sum
            if (currentSum < target) {
                left++;
            } 
            // Sum is too large; move right pointer left to decrease sum
            else {
                right--;
            }
        }
        return new int[0];
    }
}`,
          optimalPython: `def twoSum(numbers: list[int], target: int) -> list[int]:
    left = 0
    right = len(numbers) - 1
    
    # Move pointers inwards until they cross
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        # Target found; return 1-based indices
        if current_sum == target:
            return [left + 1, right + 1]
            
        # Sum is too small; move left pointer right to increase sum
        if current_sum < target:
            left += 1
        # Sum is too large; move right pointer left to decrease sum
        else:
            right -= 1
            
    return []`,
          optimalCodeExplain: '1. Since the input array is sorted, we position `left` pointer at index 0 and `right` at N-1.\\n2. We inspect their sum: if it equals target, we return the 1-based indices.\\n3. If `currentSum < target`, we need a larger value, so we shift `left` rightward. If `currentSum > target`, we need a smaller value, so we shift `right` leftward.\\n4. This yields an optimal O(N) runtime.'
        },
        {
          title: 'Reverse Array',
          leetcode: 'https://leetcode.com/problems/reverse-string/',
          gfg: 'https://www.geeksforgeeks.org/problems/reverse-an-array/1',
          questionExplain: 'Reverse the elements of an array of integers in-place.\\n\\nInput: nums = [1, 2, 3, 4, 5]\\nOutput: [5, 4, 3, 2, 1]\\n\\nConstraints:\\n- 1 <= nums.length <= 10^5\\n- -10^9 <= nums[i] <= 10^9',
          bruteExplain: 'Create an auxiliary array of the same size. Copy elements from the original array in reverse order into the auxiliary array. Then copy them back to the original array.',
          bruteComplexity: 'Time Complexity: O(N) | Space Complexity: O(N) (requires helper copy array)',
          brutePseudocode: 'Step 1: Create a temporary list temp of size N.\\nStep 2: Loop i from 0 to N-1: copy nums[N-1-i] to temp[i].\\nStep 3: Copy all values from temp back into nums.\\nStep 4: Return reversed list.',
          bruteOutput: 'Input: nums = [1, 2, 3, 4, 5]\\nOutput: [5, 4, 3, 2, 1]',
          bruteCpp: `#include <vector>

void reverseArray(std::vector<int>& nums) {
    int n = nums.size();
    std::vector<int> temp(n);
    
    // Copy elements in reverse order to temp array
    for (int i = 0; i < n; i++) {
        temp[i] = nums[n - 1 - i];
    }
    
    // Copy values back to original array
    for (int i = 0; i < n; i++) {
        nums[i] = temp[i];
    }
}`,
          bruteJava: `public class Solution {
    public void reverseArray(int[] nums) {
        int n = nums.length;
        int[] temp = new int[n];
        
        // Copy elements in reverse order to temp array
        for (int i = 0; i < n; i++) {
            temp[i] = nums[n - 1 - i];
        }
        
        // Copy values back to original array
        for (int i = 0; i < n; i++) {
            nums[i] = temp[i];
        }
    }
}`,
          brutePython: `def reverseArray(nums: list[int]) -> None:
    n = len(nums)
    temp = [0] * n
    
    # Copy elements in reverse order to temp array
    for i in range(n):
        temp[i] = nums[n - 1 - i]
        
    # Copy values back to original list
    for i in range(n):
        nums[i] = temp[i]`,
          bruteCodeExplain: '1. Instantiate an auxiliary array of size N to store temporary values.\\n2. Iterate through index `i` copying elements from the end of `nums` into `temp`.\\n3. Copy values back. This processes values twice and consumes O(N) extra space.',
          optimalExplain: 'Use two pointers: Left at index 0 and Right at index N-1. While Left is less than Right, swap the elements at these pointers, then increment Left and decrement Right. This swaps elements in-place with zero extra memory.',
          optimalComplexity: 'Time Complexity: O(N) | Space Complexity: O(1)',
          optimalPseudocode: 'Step 1: Set left = 0, right = N-1.\\nStep 2: While left < right:\\n  Swap nums[left] and nums[right].\\n  left++, right--.\\nStep 3: Return reversed array.',
          optimalOutput: 'Input: nums = [1, 2, 3, 4, 5]\\nOutput: [5, 4, 3, 2, 1]',
          optimalCpp: `#include <vector>
#include <algorithm>

void reverseArray(std::vector<int>& nums) {
    int left = 0;
    int right = nums.size() - 1;
    
    // Swap outer bounds inwards
    while (left < right) {
        std::swap(nums[left], nums[right]); // In-place swap
        left++;
        right--;
    }
}`,
          optimalJava: `public class Solution {
    public void reverseArray(int[] nums) {
        int left = 0;
        int right = nums.length - 1;
        
        // Swap outer bounds inwards
        while (left < right) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
        }
    }
}`,
          optimalPython: `def reverseArray(nums: list[int]) -> None:
    left = 0
    right = len(nums) - 1
    
    # Swap outer bounds inwards
    while left < right:
        nums[left], nums[right] = nums[right], nums[left] # Pythonic in-place swap
        left += 1
        right -= 1`,
          optimalCodeExplain: '1. Position `left` pointer at 0 and `right` at N-1.\\n2. In a loop, swap `nums[left]` and `nums[right]` and move both pointers closer to the center by one position.\\n3. This reversed sequence calculation runs in O(N) time with O(1) space complexity.'
        }
      ]
    },
    {
      name: 'Sliding Window',
      desc: 'Maintaining a contiguous subsegment (the window) that slides from left to right, updating aggregate values incrementally in O(1) per step.',
      problems: [
        {
          title: 'Maximum Sum Subarray of size K',
          leetcode: 'https://leetcode.com/problems/maximum-subarray/',
          gfg: 'https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1',
          questionExplain: 'Given an array of integers and a window size K, find the maximum sum of any contiguous subarray of size K.\\n\\nInput: nums = [2, 1, 5, 1, 3, 2], K = 3\\nOutput: 9\\n\\nConstraints:\\n- 1 <= nums.length <= 10^5\\n- 1 <= K <= nums.length\\n- -10^5 <= nums[i] <= 10^5',
          bruteExplain: 'Run a loop to select every possible starting index for a subarray of size K. Run an inner loop of size K to calculate the sum of elements from that starting index, and find the maximum sum.',
          bruteComplexity: 'Time Complexity: O(N * K) | Space Complexity: O(1)',
          brutePseudocode: 'Step 1: Set maxSum = -Infinity.\\nStep 2: Loop i from 0 to N - K:\\n  Set currentSum = 0.\\n  Loop j from 0 to K-1: add nums[i + j] to currentSum.\\n  maxSum = max(maxSum, currentSum).\\nStep 3: Return maxSum.',
          bruteOutput: 'Input: nums = [2, 1, 5, 1, 3, 2], K = 3\\nOutput: 9',
          bruteCpp: `#include <vector>
#include <algorithm>
#include <climits>

int maxSubarraySum(std::vector<int>& nums, int k) {
    int maxSum = INT_MIN;
    int n = nums.size();
    
    // Outer loop marks starting indices
    for (int i = 0; i <= n - k; i++) {
        int currentSum = 0;
        // Inner loop adds next K items
        for (int j = 0; j < k; j++) {
            currentSum += nums[i + j];
        }
        maxSum = std::max(maxSum, currentSum); // Update global maximum
    }
    return maxSum;
}`,
          bruteJava: `public class Solution {
    public int maxSubarraySum(int[] nums, int k) {
        int maxSum = Integer.MIN_VALUE;
        int n = nums.length;
        
        // Outer loop marks starting indices
        for (int i = 0; i <= n - k; i++) {
            int currentSum = 0;
            // Inner loop adds next K items
            for (int j = 0; j < k; j++) {
                currentSum += nums[i + j];
            }
            maxSum = Math.max(maxSum, currentSum); // Update global maximum
        }
        return maxSum;
    }
}`,
          brutePython: `def maxSubarraySum(nums: list[int], k: int) -> int:
    max_sum = float('-inf')
    n = len(nums)
    
    # Outer loop marks starting indices
    for i in range(n - k + 1):
        current_sum = 0
        # Inner loop adds next K items
        for j in range(k):
            current_sum += nums[i + j]
        max_sum = max(max_sum, current_sum) # Update global maximum
        
    return max_sum`,
          bruteCodeExplain: '1. Iterate index `i` representing the starting point of the subarray.\\n2. For each starting position, sum up elements in the range `[i, i+K-1]` using a secondary loop.\\n3. Track the global maximum. The time complexity is O(N * K).',
          optimalExplain: 'Calculate the sum of the first window of size K. Then, slide the window to the right by adding the next element and subtracting the element that is leaving the window on the left. Track the maximum sum found.',
          optimalComplexity: 'Time Complexity: O(N) | Space Complexity: O(1)',
          optimalPseudocode: 'Step 1: Calculate currentSum of first K elements. Set maxSum = currentSum.\\nStep 2: Loop i from K to N-1:\\n  currentSum = currentSum + nums[i] - nums[i - K].\\n  maxSum = max(maxSum, currentSum).\\nStep 3: Return maxSum.',
          optimalOutput: 'Input: nums = [2, 1, 5, 1, 3, 2], K = 3\\nOutput: 9',
          optimalCpp: `#include <vector>
#include <algorithm>

int maxSubarraySum(std::vector<int>& nums, int k) {
    int currentSum = 0;
    // Calculate the sum of the first window of size K
    for (int i = 0; i < k; i++) {
        currentSum += nums[i];
    }
    
    int maxSum = currentSum;
    
    // Slide window to the end of the array
    for (size_t i = k; i < nums.size(); i++) {
        // Add new element and subtract leaving element
        currentSum = currentSum + nums[i] - nums[i - k];
        maxSum = std::max(maxSum, currentSum); // Update maximum
    }
    return maxSum;
}`,
          optimalJava: `public class Solution {
    public int maxSubarraySum(int[] nums, int k) {
        int currentSum = 0;
        // Calculate the sum of the first window of size K
        for (int i = 0; i < k; i++) {
            currentSum += nums[i];
        }
        
        int maxSum = currentSum;
        
        // Slide window to the end of the array
        for (int i = k; i < nums.length; i++) {
            // Add new element and subtract leaving element
            currentSum = currentSum + nums[i] - nums[i - k];
            maxSum = Math.max(maxSum, currentSum); // Update maximum
        }
        return maxSum;
    }
}`,
          optimalPython: `def maxSubarraySum(nums: list[int], k: int) -> int:
    # Calculate the sum of the first window of size K
    current_sum = sum(nums[:k])
    max_sum = current_sum
    
    # Slide window to the end of the list
    for i in range(k, len(nums)):
        # Add new element and subtract leaving element
        current_sum = current_sum + nums[i] - nums[i - k]
        max_sum = max(max_sum, current_sum) # Update maximum
        
    return max_sum`,
          optimalCodeExplain: '1. Sum up the first `K` elements in O(K) time and set as initial `maxSum`.\\n2. Loop index `i` from `K` to `N-1` representing the incoming element.\\n3. Subtract the leaving element `nums[i-K]` and add the incoming element `nums[i]` to update `currentSum` in O(1) time.\\n4. Update `maxSum` if `currentSum` is larger. This runs in O(N) time.'
        },
        {
          title: 'Minimum Size Subarray Sum',
          leetcode: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
          gfg: 'https://www.geeksforgeeks.org/problems/minimum-organic-chemical-required/0/1',
          questionExplain: 'Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray whose sum is greater than or equal to target. If there is no such subarray, return 0 instead.\\n\\nInput: target = 7, nums = [2, 3, 1, 2, 4, 3]\\nOutput: 2 (subarray [4, 3] has length 2 and sums to 7)\\n\\nConstraints:\\n- 1 <= nums.length <= 10^5\\n- 1 <= nums[i] <= 10^4\\n- 1 <= target <= 10^9',
          bruteExplain: 'Check the sum of every possible contiguous subarray using nested loops. If the sum is greater than or equal to target, record its length and track the minimum length found.',
          bruteComplexity: 'Time Complexity: O(N²) | Space Complexity: O(1)',
          brutePseudocode: 'Step 1: Set minLen = Infinity.\\nStep 2: Loop i from 0 to N-1.\\n  Set currentSum = 0.\\n  Loop j from i to N-1:\\n    currentSum += nums[j].\\n    If currentSum >= target, minLen = min(minLen, j - i + 1) and break.\\nStep 3: Return minLen if minLen != Infinity else 0.',
          bruteOutput: 'Input: target = 7, nums = [2, 3, 1, 2, 4, 3]\\nOutput: 2',
          bruteCpp: `#include <vector>
#include <algorithm>
#include <climits>

int minSubArrayLen(int target, std::vector<int>& nums) {
    int minLen = INT_MAX;
    int n = nums.size();
    
    // Outer loop sets start position
    for (int i = 0; i < n; i++) {
        int currentSum = 0;
        // Inner loop expands subarray to the right
        for (int j = i; j < n; j++) {
            currentSum += nums[j];
            // Update minLen and stop expanding if target is met
            if (currentSum >= target) {
                minLen = std::min(minLen, j - i + 1);
                break;
            }
        }
    }
    return (minLen == INT_MAX) ? 0 : minLen;
}`,
          bruteJava: `public class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int minLen = Integer.MAX_VALUE;
        int n = nums.length;
        
        // Outer loop sets start position
        for (int i = 0; i < n; i++) {
            int currentSum = 0;
            // Inner loop expands subarray to the right
            for (int j = i; j < n; j++) {
                currentSum += nums[j];
                // Update minLen and stop expanding if target is met
                if (currentSum >= target) {
                    minLen = Math.min(minLen, j - i + 1);
                    break;
                }
            }
        }
        return (minLen == Integer.MAX_VALUE) ? 0 : minLen;
    }
}`,
          brutePython: `def minSubArrayLen(target: int, nums: list[int]) -> int:
    min_len = float('inf')
    n = len(nums)
    
    # Outer loop sets start position
    for i in range(n):
        current_sum = 0
        # Inner loop expands subarray to the right
        for j in range(i, n):
            current_sum += nums[j]
            # Update min_len and stop expanding if target is met
            if current_sum >= target:
                min_len = min(min_len, j - i + 1)
                break
                
    return 0 if min_len == float('inf') else min_len`,
          bruteCodeExplain: '1. Evaluate all subarrays using nested loops starting at `i` and ending at `j`.\\n2. Accumulate sum in `currentSum` and capture the length `j-i+1` if target condition is satisfied.\\n3. This quadratic search checks O(N²) subarray configurations.',
          optimalExplain: 'Use a dynamic sliding window with two pointers: left and right. Expand the window by moving right pointer and adding elements to running sum. While the sum is greater than or equal to target, update the minimum length and shrink the window from the left.',
          optimalComplexity: 'Time Complexity: O(N) | Space Complexity: O(1)',
          optimalPseudocode: 'Step 1: Set left = 0, currentSum = 0, minLen = Infinity.\\nStep 2: Loop right from 0 to N-1:\\n  Add nums[right] to currentSum.\\n  While currentSum >= target:\\n    minLen = min(minLen, right - left + 1).\\n    Subtract nums[left] from currentSum, increment left.\\nStep 3: Return minLen if minLen != Infinity else 0.',
          optimalOutput: 'Input: target = 7, nums = [2, 3, 1, 2, 4, 3]\\nOutput: 2',
          optimalCpp: `#include <vector>
#include <algorithm>
#include <climits>

int minSubArrayLen(int target, std::vector<int>& nums) {
    int left = 0;
    int currentSum = 0;
    int minLen = INT_MAX;
    
    // Slide right pointer to expand window
    for (int right = 0; right < nums.size(); right++) {
        currentSum += nums[right];
        
        // Shrink window from left as long as target sum is met
        while (currentSum >= target) {
            minLen = std::min(minLen, right - left + 1); // Record length
            currentSum -= nums[left];
            left++; // Shift left boundary
        }
    }
    return (minLen == INT_MAX) ? 0 : minLen;
}`,
          optimalJava: `public class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int left = 0;
        int currentSum = 0;
        int minLen = Integer.MAX_VALUE;
        
        // Slide right pointer to expand window
        for (int right = 0; right < nums.length; right++) {
            currentSum += nums[right];
            
            // Shrink window from left as long as target sum is met
            while (currentSum >= target) {
                minLen = Math.min(minLen, right - left + 1); // Record length
                currentSum -= nums[left];
                left++; // Shift left boundary
            }
        }
        return (minLen == Integer.MAX_VALUE) ? 0 : minLen;
    }
}`,
          optimalPython: `def minSubArrayLen(target: int, nums: list[int]) -> int:
    left = 0
    current_sum = 0
    min_len = float('inf')
    
    # Slide right pointer to expand window
    for right in range(len(nums)):
        current_sum += nums[right]
        
        # Shrink window from left as long as target sum is met
        while current_sum >= target:
            min_len = min(min_len, right - left + 1) # Record length
            current_sum -= nums[left]
            left += 1 # Shift left boundary
            
    return 0 if min_len == float('inf') else min_len`,
          optimalCodeExplain: '1. Pointers `left` and `right` outline the window boundaries. Initialize sum to 0.\\n2. For each step of `right`, we add `nums[right]` to our window.\\n3. If `currentSum >= target`, we attempt to optimize by recording the width `right-left+1`, subtracting `nums[left]`, and moving `left` forward.\\n4. Since both pointers move at most N times, the complexity is linear O(N).'
        }
      ]
    },
    {
      name: 'Prefix Sum',
      desc: 'Pre-computing cumulative array values Prefix[i] = Prefix[i-1] + Array[i] to answer range sum queries dynamically in O(1) time.',
      problems: [
        {
          title: 'Range Sum Query - Immutable',
          leetcode: 'https://leetcode.com/problems/range-sum-query-immutable/',
          gfg: 'https://www.geeksforgeeks.org/problems/range-sum-query/1',
          questionExplain: 'Given an integer array nums, handle multiple queries of the sum of elements between indices left and right inclusive.\\n\\nInput:\\nnums = [-2, 0, 3, -5, 2, -1]\\nsumRange(0, 2) -> 1\\nsumRange(2, 5) -> -1\\n\\nConstraints:\\n- 1 <= nums.length <= 10^4\\n- -10^5 <= nums[i] <= 10^5\\n- 0 <= left <= right < nums.length',
          bruteExplain: 'For every range query call, run a loop from the starting index `left` to the ending index `right` and sum the elements up.',
          bruteComplexity: 'Time Complexity: O(N) per query | Space Complexity: O(1)',
          brutePseudocode: 'Step 1: Save array elements in class constructor.\\nStep 2: In sumRange(left, right), loop from left to right, summing elements up.\\nStep 3: Return the calculated sum.',
          bruteOutput: 'Input: nums = [-2, 0, 3, -5, 2, -1], sumRange(0, 2)\\nOutput: 1',
          bruteCpp: `#include <vector>

class NumArray {
private:
    std::vector<int> data;
public:
    NumArray(std::vector<int>& nums) {
        // Save array elements
        data = nums;
    }
    
    int sumRange(int left, int right) {
        int sum = 0;
        // Loop from left to right boundary on each call
        for (int i = left; i <= right; i++) {
            sum += data[i];
        }
        return sum;
    }
};`,
          bruteJava: `class NumArray {
    private int[] data;
    
    public NumArray(int[] nums) {
        // Save array elements
        data = nums;
    }
    
    public int sumRange(int left, int right) {
        int sum = 0;
        // Loop from left to right boundary on each call
        for (int i = left; i <= right; i++) {
            sum += data[i];
        }
        return sum;
    }
}`,
          brutePython: `class NumArray:
    def __init__(self, nums: list[int]):
        # Save array elements
        self.data = nums
        
    def sumRange(self, left: int, right: int) -> int:
        val_sum = 0
        # Loop from left to right boundary on each call
        for i in range(left, right + 1):
            val_sum += self.data[i]
        return val_sum`,
          bruteCodeExplain: '1. Store the input array inside the class variable.\\n2. When `sumRange` is invoked, run a loop from `left` to `right` accumulating the sum.\\n3. This works but requires O(N) per query, which is slow for repeated lookups.',
          optimalExplain: 'Precompute cumulative sums in a prefix array of size N+1. The sum of range [left, right] is calculated instantly as prefix[right + 1] - prefix[left].',
          optimalComplexity: 'Time Complexity: O(1) per Query (O(N) setup) | Space Complexity: O(N)',
          optimalPseudocode: 'Step 1: Initialize prefix array of size N+1 with 0s.\\nStep 2: Populate: prefix[i+1] = prefix[i] + nums[i].\\nStep 3: In sumRange(left, right): return prefix[right+1] - prefix[left].',
          optimalOutput: 'Input: nums = [-2, 0, 3, -5, 2, -1], sumRange(0, 2)\\nOutput: 1',
          optimalCpp: `#include <vector>

class NumArray {
private:
    std::vector<int> prefix;
public:
    NumArray(std::vector<int>& nums) {
        // Allocate size N+1
        prefix.resize(nums.size() + 1, 0);
        
        // Populate prefix sums
        for (size_t i = 0; i < nums.size(); i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }
    
    int sumRange(int left, int right) {
        // Compute range sum instantly in constant time
        return prefix[right + 1] - prefix[left];
    }
};`,
          optimalJava: `class NumArray {
    private int[] prefix;
    
    public NumArray(int[] nums) {
        // Allocate size N+1
        prefix = new int[nums.length + 1];
        
        // Populate prefix sums
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }
    
    public int sumRange(int left, int right) {
        // Compute range sum instantly in constant time
        return prefix[right + 1] - prefix[left];
    }
}`,
          optimalPython: `class NumArray:
    def __init__(self, nums: list[int]):
        # Allocate size N+1
        self.prefix = [0] * (len(nums) + 1)
        
        # Populate prefix sums
        for i in range(len(nums)):
            self.prefix[i + 1] = self.prefix[i] + nums[i]
            
    def sumRange(self, left: int, right: int) -> int:
        # Compute range sum instantly in constant time
        return self.prefix[right + 1] - self.prefix[left]`,
          optimalCodeExplain: '1. In constructor, build a `prefix` array of size `N+1` holding cumulative sums.\\n2. `prefix[i]` holds sum of elements `nums[0...i-1]`.\\n3. For range sum `[L, R]`, compute `prefix[R + 1] - prefix[L]`. This subtracts the contribution of elements preceding index `L`, returning target sum in O(1) time.'
        },
        {
          title: 'Subarray Sum Equals K',
          leetcode: 'https://leetcode.com/problems/subarray-sum-equals-k/',
          gfg: 'https://www.geeksforgeeks.org/problems/sub-array-sum-refer-to-solutions/1',
          questionExplain: 'Given an array of integers nums and an integer K, return the total number of subarrays whose sum equals to K.\\n\\nInput: nums = [1, 1, 1], K = 2\\nOutput: 2 (subarrays [1,1] at index [0,1] and [1,1] at index [1,2])\\n\\nConstraints:\\n- 1 <= nums.length <= 2 * 10^4\\n- -1000 <= nums[i] <= 1000\\n- -10^7 <= K <= 10^7',
          bruteExplain: 'Check the sum of every possible contiguous subarray using nested loops. If the sum of any subarray equals K, increment the count.',
          bruteComplexity: 'Time Complexity: O(N²) | Space Complexity: O(1)',
          brutePseudocode: 'Step 1: Set count = 0.\\nStep 2: Loop i from 0 to N-1:\\n  Set currentSum = 0.\\n  Loop j from i to N-1:\\n    currentSum += nums[j].\\n    If currentSum == K, count++.\\nStep 3: Return count.',
          bruteOutput: 'Input: nums = [1, 1, 1], K = 2\\nOutput: 2',
          bruteCpp: `#include <vector>

int subarraySum(std::vector<int>& nums, int k) {
    int count = 0;
    int n = nums.size();
    
    // Outer loop sets start position
    for (int i = 0; i < n; i++) {
        int currentSum = 0;
        // Inner loop expands subarray to the right
        for (int j = i; j < n; j++) {
            currentSum += nums[j];
            if (currentSum == k) {
                count++; // Increment match count
            }
        }
    }
    return count;
}`,
          bruteJava: `public class Solution {
    public int subarraySum(int[] nums, int k) {
        int count = 0;
        int n = nums.length;
        
        // Outer loop sets start position
        for (int i = 0; i < n; i++) {
            int currentSum = 0;
            // Inner loop expands subarray to the right
            for (int j = i; j < n; j++) {
                currentSum += nums[j];
                if (currentSum == k) {
                    count++; // Increment match count
                }
            }
        }
        return count;
    }
}`,
          brutePython: `def subarraySum(nums: list[int], k: int) -> int:
    count = 0
    n = len(nums)
    
    # Outer loop sets start position
    for i in range(n):
        current_sum = 0
        # Inner loop expands subarray to the right
        for j in range(i, n):
            current_sum += nums[j]
            if current_sum == k:
                count += 1 # Increment match count
                
    return count`,
          bruteCodeExplain: '1. Iterate outer index `i` for starting positions and inner index `j` to accumulate running sums.\\n2. Compare sum against `k` and update our global count.\\n3. This quadratic algorithm scans O(N²) subarray options.',
          optimalExplain: 'Use a prefix sum and a Hash Map to store the frequency of prefix sums encountered. While traversing, keep track of the cumulative running sum. If (runningSum - K) is found in the Hash Map, it means there are prefix subarrays that sum up to target, so we add their frequency count to our answer.',
          optimalComplexity: 'Time Complexity: O(N) | Space Complexity: O(N)',
          optimalPseudocode: 'Step 1: Create a hash map sumMap. Seed it with sumMap[0] = 1.\\nStep 2: Set runningSum = 0, count = 0.\\nStep 3: Loop through array:\\n  runningSum += nums[i].\\n  If (runningSum - K) exists in sumMap, count += sumMap[runningSum - K].\\n  Increment sumMap[runningSum].\\nStep 4: Return count.',
          optimalOutput: 'Input: nums = [1, 1, 1], K = 2\\nOutput: 2',
          optimalCpp: `#include <vector>
#include <unordered_map>

int subarraySum(std::vector<int>& nums, int k) {
    std::unordered_map<int, int> sumMap;
    sumMap[0] = 1; // Seed value for subarrays starting from index 0
    
    int runningSum = 0;
    int count = 0;
    
    for (int num : nums) {
        runningSum += num; // Update cumulative sum
        
        // If (runningSum - K) is found, add its count to target subarrays
        if (sumMap.find(runningSum - k) != sumMap.end()) {
            count += sumMap[runningSum - k];
        }
        
        sumMap[runningSum]++; // Track prefix sum frequency
    }
    return count;
}`,
          optimalJava: `import java.util.HashMap;

public class Solution {
    public int subarraySum(int[] nums, int k) {
        HashMap<Integer, Integer> sumMap = new HashMap<>();
        sumMap.put(0, 1); // Seed value for subarrays starting from index 0
        
        int runningSum = 0;
        int count = 0;
        
        for (int num : nums) {
            runningSum += num; // Update cumulative sum
            
            // If (runningSum - K) is found, add its count to target subarrays
            if (sumMap.containsKey(runningSum - k)) {
                count += sumMap.get(runningSum - k);
            }
            
            sumMap.put(runningSum, sumMap.getOrDefault(runningSum, 0) + 1);
        }
        return count;
    }
}`,
          optimalPython: `def subarraySum(nums: list[int], k: int) -> int:
    sum_map = {0: 1} # Seed value for subarrays starting from index 0
    running_sum = 0
    count = 0
    
    for num in nums:
        running_sum += num # Update cumulative sum
        
        # If (runningSum - K) is found, add its count to target subarrays
        if (running_sum - k) in sum_map:
            count += sum_map[running_sum - k]
            
        sum_map[running_sum] = sum_map.get(running_sum, 0) + 1
        
    return count`,
          optimalCodeExplain: '1. Instantiate a map to record the frequencies of prefix sums. Seed `sumMap[0] = 1`.\\n2. Iterate through the array updating `runningSum`.\\n3. If a prefix sum equal to `runningSum - K` was seen before, it indicates the difference subarray sums to `K`. We add its frequency count to `count`.\\n4. This yields an optimal O(N) time and space complexity.'
        }
      ]
    }
  ];


  const algsData = [
    {
      name: 'Linear Search',
      desc: 'Linear Search starts at the very beginning of the array and checks each element one by one, from left to right, until it finds the target or reaches the end.',
      problems: [
        {
          title: 'Search Element in Unsorted Array (GFG)',
          leetcode: 'https://leetcode.com/problems/linear-search/',
          gfg: 'https://www.geeksforgeeks.org/problems/search-an-element-in-an-array-1587115621/1',
          questionExplain: 'Given an array of integers and a target number, find the index of the target element. If the target is not found, return -1.\\n\\nInput: nums = [9, 7, 2, 16, 4], target = 16\\nOutput: 3\\n\\nConstraints:\\n- 1 <= nums.length <= 10^5\\n- -10^9 <= nums[i], target <= 10^9',
          bruteExplain: 'Loop through the array from the first element (index 0) to the last element (index N-1), checking each item. If any element matches, return its index.',
          bruteComplexity: 'Time Complexity: O(N) | Space Complexity: O(1)',
          brutePseudocode: 'Step 1: Iterate index i from 0 to N-1.\\nStep 2: If current element arr[i] equals target, return its index i.\\nStep 3: If loop ends without matching, return -1.',
          bruteOutput: 'Input: nums = [9, 7, 2, 16, 4], target = 16\\nOutput: 3',
          bruteCpp: `#include <vector>

int search(std::vector<int>& arr, int target) {
    // Loop through all elements one by one from left to right
    for (int i = 0; i < arr.size(); i++) {
        // Check if current element matches target
        if (arr[i] == target) {
            return i; // Found target; return current index
        }
    }
    return -1; // Target not found in array
}`,
          bruteJava: `public class Solution {
    public int search(int[] arr, int target) {
        // Sequentially check each index in the array
        for (int i = 0; i < arr.length; i++) {
            // Check if current element matches target
            if (arr[i] == target) {
                return i; // Target found
            }
        }
        return -1; // Target not found
    }
}`,
          brutePython: `def search(arr: list[int], target: int) -> int:
    # Check every element and its index
    for i in range(len(arr)):
        # Check if current element matches target
        if arr[i] == target:
            return i # Found target
            
    return -1 # Not found`,
          bruteCodeExplain: '1. We iterate index `i` from `0` to `N-1` to inspect every cell in the array.\\n2. In each iteration, we compare `arr[i]` with target.\\n3. If we find a match, we return the index `i` immediately.\\n4. If the loop ends without finding target, we return `-1`.',
          optimalExplain: 'Since the array is completely unsorted, there is no way to bypass elements. The linear scan checking every element is the best possible approach.',
          optimalComplexity: 'Time Complexity: O(N) | Space Complexity: O(1)',
          optimalPseudocode: 'Step 1: Iterate index i from 0 to N-1.\\nStep 2: If current element arr[i] equals target, return its index i.\\nStep 3: If loop ends without matching, return -1.',
          optimalOutput: 'Input: nums = [9, 7, 2, 16, 4], target = 16\\nOutput: 3',
          optimalCpp: `#include <vector>

int search(std::vector<int>& arr, int target) {
    // Scan all elements linearly from left to right
    for (int i = 0; i < arr.size(); i++) {
        // Check if target matches current element
        if (arr[i] == target) {
            return i; // Match found
        }
    }
    return -1; // No match found
}`,
          optimalJava: `public class Solution {
    public int search(int[] arr, int target) {
        // Scan all elements linearly from left to right
        for (int i = 0; i < arr.length; i++) {
            // Check if target matches current element
            if (arr[i] == target) {
                return i; // Match found
            }
        }
        return -1; // No match found
    }
}`,
          optimalPython: `def search(arr: list[int], target: int) -> int:
    # Scan all elements linearly from left to right
    for i in range(len(arr)):
        # Check if target matches current element
        if arr[i] == target:
            return i # Match found
            
    return -1 # No match found`,
          optimalCodeExplain: '1. Because the array is unsorted, we must inspect every element at least once.\\n2. A sequential scan starting from index 0 is both simple and optimal.\\n3. Return the index of target if found; else return -1.'
        },
        {
          title: 'First Unique Character in a String (LeetCode 387 / GFG)',
          leetcode: 'https://leetcode.com/problems/first-unique-character-in-a-string/',
          gfg: 'https://www.geeksforgeeks.org/problems/non-repeating-character-1587115620/1',
          questionExplain: 'Given a string, find the first character that does not repeat anywhere else. Return its index. If all characters repeat, return -1.\\n\\nInput: s = "leetcode"\\nOutput: 0\\n\\nConstraints:\\n- 1 <= s.length <= 10^5\\n- s consists only of lowercase English letters.',
          bruteExplain: 'For every character at index i, run a second loop to search the rest of the string. If we find the same character at any other index j, we know it is not unique. If we check the entire string and find no match, it is our first unique character.',
          bruteComplexity: 'Time Complexity: O(N²) | Space Complexity: O(1)',
          brutePseudocode: 'Step 1: Loop index i from 0 to N-1.\\nStep 2: Set hasDuplicate = false.\\nStep 3: Loop index j from 0 to N-1: if i != j and s[i] == s[j], set hasDuplicate = true, break.\\nStep 4: If hasDuplicate is false, return index i.\\nStep 5: Return -1.',
          bruteOutput: 'Input: s = "leetcode"\\nOutput: 0',
          bruteCpp: `#include <string>

int firstUniqChar(std::string s) {
    int n = s.length();
    
    // Compare every character with all other characters
    for (int i = 0; i < n; i++) {
        bool hasDuplicate = false;
        
        for (int j = 0; j < n; j++) {
            // Match found at a different index
            if (i != j && s[i] == s[j]) {
                hasDuplicate = true;
                break;
            }
        }
        
        // Found character with no duplicates
        if (!hasDuplicate) {
            return i;
        }
    }
    return -1; // All characters repeat
}`,
          bruteJava: `public class Solution {
    public int firstUniqChar(String s) {
        int n = s.length();
        
        // Outer loop picks a character
        for (int i = 0; i < n; i++) {
            boolean hasDuplicate = false;
            
            // Inner loop scans the string for duplicate characters
            for (int j = 0; j < n; j++) {
                if (i != j && s.charAt(i) == s.charAt(j)) {
                    hasDuplicate = true;
                    break;
                }
            }
            
            // Return index of first non-repeating char
            if (!hasDuplicate) {
                return i;
            }
        }
        return -1;
    }
}`,
          brutePython: `def firstUniqChar(s: str) -> int:
    n = len(s)
    
    # Check each character against every other character
    for i in range(n):
        has_duplicate = False
        
        for j in range(n):
            if i != j and s[i] == s[j]:
                has_duplicate = True
                break
                
        if not has_duplicate:
            return i # Return index of first unique char
            
    return -1 # All characters repeat`,
          bruteCodeExplain: '1. We pick a candidate character at index `i` in the outer loop.\\n2. The inner loop scans the entire string comparing `s[i]` with all other positions `s[j]`.\\n3. If any match is found at a different index `i != j`, it is flagged as a duplicate.\\n4. The first character that has no duplicate is returned. This runs in O(N²) time.',
          optimalExplain: 'Use a frequency table. Since characters are limited, we can count frequencies in a single pass O(N) using a 256-size array. Then, loop through the string a second time and return the index of the first character whose frequency count is exactly 1.',
          optimalComplexity: 'Time Complexity: O(N) | Space Complexity: O(1) (frequency table is fixed size)',
          optimalPseudocode: 'Step 1: Construct a frequency array freq of size 256 initialized with 0s.\\nStep 2: Loop through string and increment freq[s[i]].\\nStep 3: Loop through string: if freq[s[i]] == 1, return index i.\\nStep 4: Return -1.',
          optimalOutput: 'Input: s = "leetcode"\\nOutput: 0',
          optimalCpp: `#include <string>
#include <vector>

int firstUniqChar(std::string s) {
    // Stores frequencies for all characters (ASCII covers 256 chars)
    std::vector<int> freq(256, 0); 
    
    // Pass 1: Count frequency of each character
    for (char c : s) {
        freq[(unsigned char)c]++;
    }
    
    // Pass 2: Linearly search for first char with frequency = 1
    for (int i = 0; i < s.length(); i++) {
        if (freq[(unsigned char)s[i]] == 1) {
            return i; // Found first unique character index
        }
    }
    return -1; // No unique character exists
}`,
          optimalJava: `public class Solution {
    public int firstUniqChar(String s) {
        int[] freq = new int[256]; // Size 256 covers standard ASCII characters
        
        // Pass 1: Populate character frequency map
        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i)]++;
        }
        
        // Pass 2: Find the first index with count equal to 1
        for (int i = 0; i < s.length(); i++) {
            if (freq[s.charAt(i)] == 1) {
                return i; // Found first unique character index
            }
        }
        return -1;
    }
}`,
          optimalPython: `def firstUniqChar(s: str) -> int:
    freq = {}
    
    # Pass 1: Count frequency of each character
    for char in s:
        freq[char] = freq.get(char, 0) + 1
        
    # Pass 2: Linearly scan the string to find first unique character
    for i in range(len(s)):
        if freq[s[i]] == 1:
            return i # Found first unique character index
            
    return -1 # No unique character exists`,
          optimalCodeExplain: '1. Instantiate a frequency array or hash map to store count of each character.\\n2. Pass 1: Iterate through string and increment counts.\\n3. Pass 2: Iterate through string again, checking count of each character. The first one with count equal to 1 is the first unique character, and we return its index.'
        }
      ]
    },
    {
      name: 'Binary Search',
      desc: 'Binary Search searches a sorted array by looking at the middle element, reducing the search space by half in each step.',
      problems: [
        {
          title: 'Binary Search Target (LeetCode 704 / GFG)',
          leetcode: 'https://leetcode.com/problems/binary-search/',
          gfg: 'https://www.geeksforgeeks.org/problems/binary-search-1587115620/1',
          questionExplain: 'Given an array of integers sorted in ascending order and a target value, find the index of the target. If target exists, return its index. Otherwise, return -1.\\n\\nInput: nums = [-1, 0, 3, 5, 9, 12], target = 9\\nOutput: 4\\n\\nConstraints:\\n- 1 <= nums.length <= 10^4\\n- -10^4 < nums[i], target < 10^4\\n- All integers in nums are unique and sorted in ascending order.',
          bruteExplain: 'Ignore that the array is sorted. Start from the first element and search linearly one by one until the target is found. This does not take advantage of sorted order.',
          bruteComplexity: 'Time Complexity: O(N) | Space Complexity: O(1)',
          brutePseudocode: 'Step 1: Iterate index i from 0 to N-1.\\nStep 2: Compare nums[i] with target. If match, return i.\\nStep 3: Return -1 if not found.',
          bruteOutput: 'Input: nums = [-1, 0, 3, 5, 9, 12], target = 9\\nOutput: 4',
          bruteCpp: `#include <vector>

int search(std::vector<int>& nums, int target) {
    // Check every element from index 0 to N-1
    for (int i = 0; i < nums.size(); i++) {
        // If element matches target, return index
        if (nums[i] == target) {
            return i;
        }
    }
    return -1;
}`,
          bruteJava: `public class Solution {
    public int search(int[] nums, int target) {
        // Iterate through all elements linearly
        for (int i = 0; i < nums.length; i++) {
            // Check if current element is target
            if (nums[i] == target) {
                return i;
            }
        }
        return -1;
    }
}`,
          brutePython: `def search(nums: list[int], target: int) -> int:
    # Check elements sequentially
    for i in range(len(nums)):
        if nums[i] == target:
            return i
            
    return -1`,
          bruteCodeExplain: '1. We scan every element of the array one by one starting from index 0.\\n2. Although the array is sorted, this approach ignores that property and behaves like linear search.\\n3. Return the index of the matching element or `-1` if not found.',
          optimalExplain: 'Use two pointers (low and high) to define the boundaries. Calculate the middle index (mid). If target equals nums[mid], return mid. If target is larger, adjust search range to the right half (low = mid + 1). If target is smaller, adjust search range to the left half (high = mid - 1). This halves the search space at each step.',
          optimalComplexity: 'Time Complexity: O(log N) | Space Complexity: O(1)',
          optimalPseudocode: 'Step 1: Initialize low = 0, high = N-1.\\nStep 2: While low <= high, calculate mid = low + (high - low) / 2.\\nStep 3: If nums[mid] == target, return mid.\\nStep 4: If nums[mid] < target, update low = mid + 1. Else, update high = mid - 1.\\nStep 5: Return -1.',
          optimalOutput: 'Input: nums = [-1, 0, 3, 5, 9, 12], target = 9\\nOutput: 4',
          optimalCpp: `#include <vector>

int search(std::vector<int>& nums, int target) {
    int low = 0;
    int high = nums.size() - 1;
    
    // Loop until boundaries cross
    while (low <= high) {
        // Avoid integer overflow
        int mid = low + (high - low) / 2;
        
        if (nums[mid] == target) {
            return mid; // Target found
        }
        
        // Target is larger; search the right half
        if (nums[mid] < target) {
            low = mid + 1;
        } 
        // Target is smaller; search the left half
        else {
            high = mid - 1;
        }
    }
    return -1; // Target not found
}`,
          optimalJava: `public class Solution {
    public int search(int[] nums, int target) {
        int low = 0;
        int high = nums.length - 1;
        
        // Loop until boundaries cross
        while (low <= high) {
            // Avoid integer overflow
            int mid = low + (high - low) / 2;
            
            if (nums[mid] == target) {
                return mid; // Target found
            }
            
            // Target is larger; search the right half
            if (nums[mid] < target) {
                low = mid + 1;
            } 
            // Target is smaller; search the left half
            else {
                high = mid - 1;
            }
        }
        return -1; // Target not found
    }
}`,
          optimalPython: `def search(nums: list[int], target: int) -> int:
    low = 0
    high = len(nums) - 1
    
    # Loop until boundaries cross
    while low <= high:
        # Avoid integer overflow
        mid = low + (high - low) // 2
        
        if nums[mid] == target:
            return mid # Target found
            
        # Target is larger; search the right half
        if nums[mid] < target:
            low = mid + 1
        # Target is smaller; search the left half
        else:
            high = mid - 1
            
    return -1 # Target not found`,
          optimalCodeExplain: '1. Place pointers `low` at 0 and `high` at N-1.\\n2. Divide the search space in half by checking the middle element `nums[mid]`.\\n3. If `nums[mid]` is the target, return index `mid`.\\n4. If `nums[mid]` is smaller, we shift `low` to `mid + 1` to search the right half. Otherwise, we shift `high` to `mid - 1` to search the left half.'
        },
        {
          title: 'Search Insert Position (LeetCode 35 / GFG)',
          leetcode: 'https://leetcode.com/problems/search-insert-position/',
          gfg: 'https://www.geeksforgeeks.org/problems/search-insert-position-of-k-in-a-sorted-array/1',
          questionExplain: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.\\n\\nInput: nums = [1, 3, 5, 6], target = 5\\nOutput: 2\\n\\nConstraints:\\n- 1 <= nums.length <= 10^4\\n- -10^4 <= nums[i], target <= 10^4\\n- nums contains distinct values sorted in ascending order.',
          bruteExplain: 'Loop through the array from left to right. The first index where the element is greater than or equal to the target is the correct insertion index. If no such element exists, target should go at the end (index N).',
          bruteComplexity: 'Time Complexity: O(N) | Space Complexity: O(1)',
          brutePseudocode: 'Step 1: Loop index i from 0 to N-1.\\nStep 2: If nums[i] >= target, return index i.\\nStep 3: Return N if target is larger than all elements.',
          bruteOutput: 'Input: nums = [1, 3, 5, 6], target = 5\\nOutput: 2',
          bruteCpp: `#include <vector>

int searchInsert(std::vector<int>& nums, int target) {
    // Scan array from left to right
    for (int i = 0; i < nums.size(); i++) {
        if (nums[i] >= target) {
            return i; // Target is equal or should go before nums[i]
        }
    }
    return nums.size(); // Insertion position at the very end
}`,
          bruteJava: `public class Solution {
    public int searchInsert(int[] nums, int target) {
        // Iterate through array to find insertion spot
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] >= target) {
                return i;
            }
        }
        return nums.length;
    }
}`,
          brutePython: `def searchInsert(nums: list[int], target: int) -> int:
    # Scan list to find insertion spot
    for i in range(len(nums)):
        if nums[i] >= target:
            return i
            
    return len(nums)`,
          bruteCodeExplain: '1. Traverse the array sequentially.\\n2. The first index `i` where `nums[i]` is greater than or equal to the target represents the correct index where target should be inserted.\\n3. If target is larger than all elements, it goes at the end of the array (index N).',
          optimalExplain: 'Use Binary Search. Maintain a variable `ans` initialized to the array length. If middle element `nums[mid] >= target`, it is a potential insertion position. We save `ans = mid` and search the left half (`high = mid - 1`) to find if there is an even earlier insertion index. Otherwise, we search the right half.',
          optimalComplexity: 'Time Complexity: O(log N) | Space Complexity: O(1)',
          optimalPseudocode: 'Step 1: Set low = 0, high = N-1, ans = N.\\nStep 2: While low <= high:\\n  mid = low + (high - low) / 2.\\n  If nums[mid] >= target, ans = mid, high = mid - 1.\\n  Else, low = mid + 1.\\nStep 3: Return ans.',
          optimalOutput: 'Input: nums = [1, 3, 5, 6], target = 5\\nOutput: 2',
          optimalCpp: `#include <vector>

int searchInsert(std::vector<int>& nums, int target) {
    int low = 0;
    int high = nums.size() - 1;
    int ans = nums.size(); // Default insertion at the end
    
    while (low <= high) {
        int mid = low + (high - low) / 2;
        
        // Candidate insertion index found
        if (nums[mid] >= target) {
            ans = mid; 
            high = mid - 1; // Look left for possible smaller indices
        } else {
            low = mid + 1; // Look right
        }
    }
    return ans;
}`,
          optimalJava: `public class Solution {
    public int searchInsert(int[] nums, int target) {
        int low = 0;
        int high = nums.length - 1;
        int ans = nums.length;
        
        while (low <= high) {
            int mid = low + (high - low) / 2;
            
            // Candidate insertion index found
            if (nums[mid] >= target) {
                ans = mid;
                high = mid - 1; // Look left for possible smaller indices
            } else {
                low = mid + 1; // Look right
            }
        }
        return ans;
    }
}`,
          optimalPython: `def searchInsert(nums: list[int], target: int) -> int:
    low, high = 0, len(nums) - 1
    ans = len(nums)
    
    while low <= high:
        mid = low + (high - low) // 2
        
        # Candidate insertion index found
        if nums[mid] >= target:
            ans = mid
            high = mid - 1 # Look left for possible smaller indices
        else:
            low = mid + 1 # Look right
            
    return ans`,
          optimalCodeExplain: '1. Position pointers `low` at 0 and `high` at N-1. Initialize `ans` to N.\\n2. Using binary search, find the middle index `mid`.\\n3. If `nums[mid]` is greater than or equal to target, it means the target can be inserted here (or even further left). We record `ans = mid` and move `high` to `mid - 1` to keep looking left.\\n4. Otherwise, we search the right half by updating `low = mid + 1`.'
        }
      ]
    },
    {
      name: "Kadane's",
      desc: "Kadane's Algorithm maintains a running sum of a contiguous subarray, discarding it if it falls below 0 since negative prefix sums hurt future contiguous subarray totals.",
      problems: [
        {
          title: 'Maximum Subarray Sum (LeetCode 53 / GFG)',
          leetcode: 'https://leetcode.com/problems/maximum-subarray/',
          gfg: 'https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1',
          questionExplain: 'Given an integer array, find the contiguous subarray which has the largest sum and return its sum.\\n\\nInput: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\\nOutput: 6 (subarray [4,-1,2,1] at index [3..6] sums to 6)\\n\\nConstraints:\\n- 1 <= nums.length <= 10^5\\n- -10^4 <= nums[i] <= 10^4',
          bruteExplain: 'Use nested loops to check every possible subarray. The outer loop starts at index i and the inner loop ends at index j. Calculate the sum of elements from i to j and track the maximum sum.',
          bruteComplexity: 'Time Complexity: O(N²) | Space Complexity: O(1)',
          brutePseudocode: 'Step 1: Initialize maxSum = nums[0].\\nStep 2: Loop i from 0 to N-1.\\nStep 3: Initialize currentSum = 0.\\nStep 4: Loop j from i to N-1. Add nums[j] to currentSum, update maxSum = max(maxSum, currentSum).\\nStep 5: Return maxSum.',
          bruteOutput: 'Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\\nOutput: 6',
          bruteCpp: `#include <vector>
#include <algorithm>

int maxSubArray(std::vector<int>& nums) {
    int maxSum = nums[0];
    int n = nums.size();
    
    // Outer loop selects the starting element
    for (int i = 0; i < n; i++) {
        int currentSum = 0;
        // Inner loop runs to the end of the array
        for (int j = i; j < n; j++) {
            currentSum += nums[j]; // Sum of subarray [i...j]
            maxSum = std::max(maxSum, currentSum); // Update maximum sum
        }
    }
    return maxSum;
}`,
          bruteJava: `public class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int n = nums.length;
        
        // Outer loop selects the starting element
        for (int i = 0; i < n; i++) {
            int currentSum = 0;
            // Inner loop runs to the end of the array
            for (int j = i; j < n; j++) {
                currentSum += nums[j]; // Sum of subarray [i...j]
                maxSum = Math.max(maxSum, currentSum); // Update maximum sum
            }
        }
        return maxSum;
    }
}`,
          brutePython: `def maxSubArray(nums: list[int]) -> int:
    max_sum = nums[0]
    n = len(nums)
    
    # Outer loop selects the starting element
    for i in range(n):
        current_sum = 0
        # Inner loop runs to the end of the list
        for j in range(i, n):
            current_sum += nums[j] # Sum of subarray [i...j]
            if current_sum > max_sum:
                max_sum = current_sum # Update maximum sum
                
    return max_sum`,
          bruteCodeExplain: '1. The outer loop selects the starting position `i` of the subarray.\\n2. The inner loop expands the subarray to the right (index `j`), updating the sum incrementally.\\n3. We check if the sum of `nums[i...j]` is larger than `maxSum` and update it.\\n4. This yields an O(N²) time complexity.',
          optimalExplain: "Use Kadane's Algorithm. Walk through the array. Keep adding each element to a `currentSum`. If `currentSum` becomes negative, discard it and reset `currentSum = 0`. At each step, update `maxSoFar` if `currentSum` exceeds it.",
          optimalComplexity: 'Time Complexity: O(N) | Space Complexity: O(1)',
          optimalPseudocode: 'Step 1: Set maxSoFar = nums[0], currentSum = 0.\\nStep 2: Iterate through the array. Add nums[i] to currentSum.\\nStep 3: Update maxSoFar = max(maxSoFar, currentSum).\\nStep 4: If currentSum < 0, reset currentSum = 0.\\nStep 5: Return maxSoFar.',
          optimalOutput: 'Input: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\\nOutput: 6',
          optimalCpp: `#include <vector>
#include <algorithm>

int maxSubArray(std::vector<int>& nums) {
    int maxSoFar = nums[0];
    int currentSum = 0;
    
    for (int i = 0; i < nums.size(); i++) {
        currentSum += nums[i]; // Add current element to running sum
        
        if (currentSum > maxSoFar) {
            maxSoFar = currentSum; // Update global maximum sum
        }
        
        if (currentSum < 0) {
            currentSum = 0; // Reset running sum if it goes negative
        }
    }
    return maxSoFar;
}`,
          optimalJava: `public class Solution {
    public int maxSubArray(int[] nums) {
        int maxSoFar = nums[0];
        int currentSum = 0;
        
        for (int i = 0; i < nums.length; i++) {
            currentSum += nums[i]; // Add current element to running sum
            
            if (currentSum > maxSoFar) {
                maxSoFar = currentSum; // Update global maximum sum
            }
            
            if (currentSum < 0) {
                currentSum = 0; // Reset running sum if it goes negative
            }
        }
        return maxSoFar;
    }
}`,
          optimalPython: `def maxSubArray(nums: list[int]) -> int:
    max_so_far = nums[0]
    current_sum = 0
    
    for num in nums:
        current_sum += num # Add current element to running sum
        
        if current_sum > max_so_far:
            max_so_far = current_sum # Update global maximum sum
            
        if current_sum < 0:
            current_sum = 0 # Reset running sum if it goes negative
            
    return max_so_far`,
          optimalCodeExplain: '1. Initialize `maxSoFar` with the first element and a running `currentSum` with 0.\\n2. Iterate through the array, adding each element to `currentSum`.\\n3. If `currentSum` is larger than `maxSoFar`, update `maxSoFar`.\\n4. If `currentSum` falls below 0, reset it to 0 since a negative running sum will only decrease the sum of any subsequent subarray.'
        },
        {
          title: 'Maximum Product Subarray (LeetCode 152 / GFG)',
          leetcode: 'https://leetcode.com/problems/maximum-product-subarray/',
          gfg: 'https://www.geeksforgeeks.org/problems/maximum-product-subarray3604/1',
          questionExplain: 'Given an integer array, find a contiguous subarray that has the largest product and return that product.\\n\\nInput: nums = [2, 3, -2, 4]\\nOutput: 6 (subarray [2,3] at index [0,1] has product 6)\\n\\nConstraints:\\n- 1 <= nums.length <= 2 * 10^4\\n- -10 <= nums[i] <= 10',
          bruteExplain: 'Use nested loops to check the product of every single subarray. The outer loop starts at i and the inner loop ends at j. Calculate product of elements from i to j and track the maximum product.',
          bruteComplexity: 'Time Complexity: O(N²) | Space Complexity: O(1)',
          brutePseudocode: 'Step 1: Initialize maxProd = nums[0].\\nStep 2: Loop i from 0 to N-1.\\nStep 3: Initialize currentProd = 1.\\nStep 4: Loop j from i to N-1. Multiply currentProd by nums[j], update maxProd = max(maxProd, currentProd).\\nStep 5: Return maxProd.',
          bruteOutput: 'Input: nums = [2, 3, -2, 4]\\nOutput: 6',
          bruteCpp: `#include <vector>
#include <algorithm>

int maxProduct(std::vector<int>& nums) {
    int maxProd = nums[0];
    int n = nums.size();
    
    // Outer loop selects starting boundary
    for (int i = 0; i < n; i++) {
        int currentProd = 1;
        // Inner loop expands subarray to the right
        for (int j = i; j < n; j++) {
            currentProd *= nums[j]; // Product of subarray [i...j]
            maxProd = std::max(maxProd, currentProd); // Update maximum product
        }
    }
    return maxProd;
}`,
          bruteJava: `public class Solution {
    public int maxProduct(int[] nums) {
        int maxProd = nums[0];
        int n = nums.length;
        
        // Outer loop selects starting boundary
        for (int i = 0; i < n; i++) {
            int currentProd = 1;
            // Inner loop expands subarray to the right
            for (int j = i; j < n; j++) {
                currentProd *= nums[j]; // Product of subarray [i...j]
                maxProd = Math.max(maxProd, currentProd); // Update maximum product
            }
        }
        return maxProd;
    }
}`,
          brutePython: `def maxProduct(nums: list[int]) -> int:
    max_prod = nums[0]
    n = len(nums)
    
    # Outer loop selects starting boundary
    for i in range(n):
        current_prod = 1
        # Inner loop expands subarray to the right
        for j in range(i, n):
            current_prod *= nums[j] # Product of subarray [i...j]
            if current_prod > max_prod:
                max_prod = current_prod # Update maximum product
                
    return max_prod`,
          bruteCodeExplain: '1. We use nested loops to evaluate the product of all subarrays `nums[i...j]`.\\n2. The outer loop selects the start index `i`.\\n3. The inner loop multiplies elements sequentially into a running product `currentProd`.\\n4. We update the maximum product at each step.',
          optimalExplain: 'Walk through the array. Track both the maximum product AND the minimum product ending at the current index. Since multiplying a negative number by another negative number yields a positive number, we swap our max and min product trackers whenever we encounter a negative number, before updating them.',
          optimalComplexity: 'Time Complexity: O(N) | Space Complexity: O(1)',
          optimalPseudocode: 'Step 1: Initialize maxProd = nums[0], minProd = nums[0], globalMax = nums[0].\\nStep 2: Iterate i from 1 to N-1.\\nStep 3: If nums[i] is negative, swap maxProd and minProd.\\nStep 4: Update maxProd = max(nums[i], maxProd * nums[i]) and minProd = min(nums[i], minProd * nums[i]).\\nStep 5: Update globalMax = max(globalMax, maxProd).\\nStep 6: Return globalMax.',
          optimalOutput: 'Input: nums = [2, 3, -2, 4]\\nOutput: 6',
          optimalCpp: `#include <vector>
#include <algorithm>

int maxProduct(std::vector<int>& nums) {
    int maxProd = nums[0];
    int minProd = nums[0];
    int globalMax = nums[0];
    
    // Maintain maximum and minimum product trackers
    for (size_t i = 1; i < nums.size(); i++) {
        // Swap bounds if current element is negative
        if (nums[i] < 0) {
            std::swap(maxProd, minProd);
        }
        
        // Calculate max and min products ending here
        maxProd = std::max(nums[i], maxProd * nums[i]);
        minProd = std::min(nums[i], minProd * nums[i]);
        
        globalMax = std::max(globalMax, maxProd);
    }
    return globalMax;
}`,
          optimalJava: `public class Solution {
    public int maxProduct(int[] nums) {
        int maxProd = nums[0];
        int minProd = nums[0];
        int globalMax = nums[0];
        
        // Maintain maximum and minimum product trackers
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] < 0) {
                // Swapping trackers when multiplying by a negative number
                int temp = maxProd;
                maxProd = minProd;
                minProd = temp;
            }
            
            maxProd = Math.max(nums[i], maxProd * nums[i]);
            minProd = Math.min(nums[i], minProd * nums[i]);
            
            globalMax = Math.max(globalMax, maxProd);
        }
        return globalMax;
    }
}`,
          optimalPython: `def maxProduct(nums: list[int]) -> int:
    max_prod = nums[0]
    min_prod = nums[0]
    global_max = nums[0]
    
    # Maintain maximum and minimum product trackers
    for i in range(1, len(nums)):
        val = nums[i]
        if val < 0:
            max_prod, min_prod = min_prod, max_prod # Swap bounds
            
        max_prod = max(val, max_prod * val)
        min_prod = min(val, min_prod * val)
        global_max = max(global_max, max_prod)
        
    return global_max`,
          optimalCodeExplain: '1. Initialize maximum product tracker `maxProd`, minimum tracker `minProd`, and a global maximum `globalMax` with the first element.\\n2. Iterate through the array starting from index 1.\\n3. If the current number is negative, swap `maxProd` and `minProd` because multiplying a negative value flips the minimum and maximum.\\n4. Update `maxProd` to be the maximum of `val` or `maxProd * val`. Update `minProd` similarly.\\n5. Keep track of the highest product found in `globalMax`.'
        }
      ]
    },
    {
      name: 'Dutch National Flag',
      desc: 'Dutch National Flag (DNF) sorts an array containing three distinct elements (like 0s, 1s, 2s) in a single pass in-place using three pointers (low, mid, high).',
      problems: [
        {
          title: 'Sort Colors 0s, 1s, 2s (LeetCode 75 / GFG)',
          leetcode: 'https://leetcode.com/problems/sort-colors/',
          gfg: 'https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1',
          questionExplain: 'Given an array with N elements colored red, white, or blue (represented as 0s, 1s, and 2s), sort them in-place so that elements of the same color are adjacent in the order 0s, 1s, and then 2s.',
          bruteExplain: 'Count the occurrences of 0s, 1s, and 2s in a first pass, then overwrite the array in a second pass in sorted order.',
          bruteComplexity: 'Time Complexity: O(N) (Two-Pass) | Space Complexity: O(1)',
          brutePseudocode: 'Step 1: Count occurrences of 0s, 1s, 2s.\\nStep 2: Loop and overwrite first count0 cells with 0, next count1 cells with 1, and final count2 cells with 2.',
          bruteOutput: 'Input: nums = [2, 0, 2, 1, 1, 0]\\nOutput: [0, 0, 1, 1, 2, 2]',
          bruteCpp: `#include <vector>

void sortColors(std::vector<int>& nums) {
    int c0 = 0, c1 = 0, c2 = 0;
    
    // Pass 1: Count occurrences of each color
    for (int x : nums) {
        if (x == 0) c0++;
        else if (x == 1) c1++;
        else c2++;
    }
    
    // Pass 2: Overwrite the array in order
    int idx = 0;
    while (c0--) nums[idx++] = 0;
    while (c1--) nums[idx++] = 1;
    while (c2--) nums[idx++] = 2;
}`,
          bruteJava: `public class Solution {
    public void sortColors(int[] nums) {
        int c0 = 0, c1 = 0, c2 = 0;
        
        // Pass 1: Count occurrences of each color
        for (int x : nums) {
            if (x == 0) c0++;
            else if (x == 1) c1++;
            else c2++;
        }
        
        // Pass 2: Overwrite the array in order
        int idx = 0;
        for (int i = 0; i < c0; i++) nums[idx++] = 0;
        for (int i = 0; i < c1; i++) nums[idx++] = 1;
        for (int i = 0; i < c2; i++) nums[idx++] = 2;
    }
}`,
          brutePython: `def sortColors(nums: list[int]) -> None:
    c0, c1, c2 = 0, 0, 0
    
    # Pass 1: Count occurrences of each color
    for x in nums:
        if x == 0: c0 += 1
        elif x == 1: c1 += 1
        else: c2 += 1
        
    # Pass 2: Overwrite the list in order
    idx = 0
    for i in range(c0):
        nums[idx] = 0
        idx += 1
    for i in range(c1):
        nums[idx] = 1
        idx += 1
    for i in range(c2):
        nums[idx] = 2
        idx += 1`,
          bruteCodeExplain: '1. Perform a first pass to count the frequencies of `0`s, `1`s, and `2`s in variables `c0`, `c1`, and `c2`.\\n2. In the second pass, overwrite the original array index-by-index: writing `c0` zeros first, then `c1` ones, and then `c2` twos.\\n3. This solves the sorting problem in two passes with O(N) time.',
          optimalExplain: 'Use three pointers: `low` at start, `high` at end, and `mid` scanning elements. If `nums[mid] == 0`, swap with `low` and increment low and mid. If `nums[mid] == 1`, just increment `mid`. If `nums[mid] == 2`, swap with `high` and decrement `high` without moving `mid`.',
          optimalComplexity: 'Time Complexity: O(N) (One-pass) | Space Complexity: O(1) (In-place)',
          optimalPseudocode: 'Step 1: Set low = 0, mid = 0, high = N-1.\\nStep 2: While mid <= high:\\n  If nums[mid] == 0, swap nums[low] and nums[mid], low++, mid++.\\n  If nums[mid] == 1, mid++.\\n  If nums[mid] == 2, swap nums[mid] and nums[high], high--.\\nStep 3: Return sorted array.',
          optimalOutput: 'Input: nums = [2, 0, 2, 1, 1, 0]\\nOutput: [0, 0, 1, 1, 2, 2]',
          optimalCpp: `#include <vector>
#include <algorithm>

void sortColors(std::vector<int>& nums) {
    int low = 0;
    int mid = 0;
    int high = nums.size() - 1;
    
    // Sort array in-place in a single pass
    while (mid <= high) {
        if (nums[mid] == 0) {
            std::swap(nums[low], nums[mid]);
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            std::swap(nums[mid], nums[high]);
            high--; // Scan boundaries; mid is not incremented
        }
    }
}`,
          optimalJava: `public class Solution {
    public void sortColors(int[] nums) {
        int low = 0;
        int mid = 0;
        int high = nums.length - 1;
        
        // Sort array in-place in a single pass
        while (mid <= high) {
            if (nums[mid] == 0) {
                int temp = nums[low];
                nums[low] = nums[mid];
                nums[mid] = temp;
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                int temp = nums[high];
                nums[high] = nums[mid];
                nums[mid] = temp;
                high--; // mid is not incremented
            }
        }
    }
}`,
          optimalPython: `def sortColors(nums: list[int]) -> None:
    low, mid = 0, 0
    high = len(nums) - 1
    
    # Sort list in-place in a single pass
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1`,
          optimalCodeExplain: '1. Three pointers partition the array: elements before `low` are 0s, elements between `low` and `mid` are 1s, and elements after `high` are 2s.\\n2. When `nums[mid]` is 0, we swap it to the left side (`low`) and advance both `low` and `mid`.\\n3. When `nums[mid]` is 1, it is already in the correct zone, so we just advance `mid`.\\n4. When `nums[mid]` is 2, we swap it to the right side (`high`) and decrement `high` without advancing `mid` since we need to inspect the swapped element.'
        },
        {
          title: 'Sort Array By Parity (LeetCode 905 / GFG)',
          leetcode: 'https://leetcode.com/problems/sort-array-by-parity/',
          gfg: 'https://www.geeksforgeeks.org/problems/sort-array-by-parity/1',
          questionExplain: 'Rearrange the elements of an array so that all even integers are at the beginning of the array, followed by all odd integers.\\n\\nInput: nums = [3, 1, 2, 4]\\nOutput: [2, 4, 3, 1]\\n\\nConstraints:\\n- 1 <= nums.length <= 5000\\n- 0 <= nums[i] <= 5000',
          bruteExplain: 'Create a new array of the same size. Walk through the input array and copy all even numbers first, then walk through again and copy all odd numbers. Finally, copy it back.',
          bruteComplexity: 'Time Complexity: O(N) | Space Complexity: O(N)',
          brutePseudocode: 'Step 1: Create a results list.\\nStep 2: Loop and copy even elements into results.\\nStep 3: Loop and copy odd elements into results.\\nStep 4: Return results.',
          bruteOutput: 'Input: nums = [3, 1, 2, 4]\\nOutput: [2, 4, 3, 1]',
          bruteCpp: `#include <vector>

std::vector<int> sortArrayByParity(std::vector<int>& nums) {
    std::vector<int> result;
    
    // Copy evens first
    for (int x : nums) {
        if (x % 2 == 0) {
            result.push_back(x);
        }
    }
    
    // Copy odds second
    for (int x : nums) {
        if (x % 2 != 0) {
            result.push_back(x);
        }
    }
    return result;
}`,
          bruteJava: `public class Solution {
    public int[] sortArrayByParity(int[] nums) {
        int[] result = new int[nums.length];
        int idx = 0;
        
        // Copy evens first
        for (int x : nums) {
            if (x % 2 == 0) {
                result[idx++] = x;
            }
        }
        
        // Copy odds second
        for (int x : nums) {
            if (x % 2 != 0) {
                result[idx++] = x;
            }
        }
        return result;
    }
}`,
          brutePython: `def sortArrayByParity(nums: list[int]) -> list[int]:
    # Collect even elements first
    evens = [x for x in nums if x % 2 == 0]
    
    # Collect odd elements second
    odds = [x for x in nums if x % 2 != 0]
    
    return evens + odds`,
          bruteCodeExplain: '1. We instantiate a helper collection of the same size.\\n2. In a first iteration, we copy all even elements.\\n3. In a second iteration, we copy all odd elements.\\n4. Return the combined results, which uses O(N) extra space.',
          optimalExplain: 'Use two pointers: `left` at the start and `right` at the end. While `left < right`: if `nums[left]` is odd and `nums[right]` is even, swap them. If `nums[left]` is even, increment `left`. If `nums[right]` is odd, decrement `right`. This runs in-place.',
          optimalComplexity: 'Time Complexity: O(N) | Space Complexity: O(1)',
          optimalPseudocode: 'Step 1: Set left = 0, right = N-1.\\nStep 2: While left < right:\\n  If nums[left] is odd and nums[right] is even, swap nums[left] and nums[right].\\n  If nums[left] is even, left++.\\n  If nums[right] is odd, right--.\\nStep 3: Return nums.',
          optimalOutput: 'Input: nums = [3, 1, 2, 4]\\nOutput: [2, 4, 3, 1]',
          optimalCpp: `#include <vector>
#include <algorithm>

std::vector<int> sortArrayByParity(std::vector<int>& nums) {
    int left = 0;
    int right = nums.size() - 1;
    
    while (left < right) {
        // Swap if left element is odd and right element is even
        if (nums[left] % 2 > nums[right] % 2) {
            std::swap(nums[left], nums[right]);
        }
        
        // Advance left pointer if it points to an even number
        if (nums[left] % 2 == 0) {
            left++;
        }
        // Retract right pointer if it points to an odd number
        if (nums[right] % 2 != 0) {
            right--;
        }
    }
    return nums;
}`,
          optimalJava: `public class Solution {
    public int[] sortArrayByParity(int[] nums) {
        int left = 0;
        int right = nums.length - 1;
        
        while (left < right) {
            // Swap if left element is odd and right element is even
            if (nums[left] % 2 > nums[right] % 2) {
                int temp = nums[left];
                nums[left] = nums[right];
                nums[right] = temp;
            }
            
            // Advance left pointer if it points to an even number
            if (nums[left] % 2 == 0) {
                left++;
            }
            // Retract right pointer if it points to an odd number
            if (nums[right] % 2 != 0) {
                right--;
            }
        }
        return nums;
    }
}`,
          optimalPython: `def sortArrayByParity(nums: list[int]) -> list[int]:
    left, right = 0, len(nums) - 1
    
    while left < right:
        # Swap if left element is odd and right element is even
        if nums[left] % 2 > nums[right] % 2:
            nums[left], nums[right] = nums[right], nums[left]
            
        # Advance left pointer if it points to an even number
        if nums[left] % 2 == 0:
            left += 1
        # Retract right pointer if it points to an odd number
        if nums[right] % 2 != 0:
            right -= 1
            
    return nums`,
          optimalCodeExplain: '1. Position pointer `left` at the start of the array and pointer `right` at the end.\\n2. While `left` is less than `right`, inspect their parities.\\n3. If the value at `left` is odd and the value at `right` is even, swap them to put the even element first.\\n4. Move pointers inward: increment `left` if the number is already even; decrement `right` if it is already odd.'
        }
      ]
    },
    {
      name: 'Prefix Sum',
      desc: 'Prefix Sum constructs a helper array where each index stores the cumulative sum of elements from index 0 up to that point. This allows constant-time query lookup.',
      problems: [
        {
          title: 'Range Sum Query - Immutable (LeetCode 303 / GFG)',
          leetcode: 'https://leetcode.com/problems/range-sum-query-immutable/',
          gfg: 'https://www.geeksforgeeks.org/problems/range-sum-query/1',
          questionExplain: 'Calculate the sum of the elements of an array between indices left and right inclusive. We will need to perform this query many times.\\n\\nInput:\\nNumArray = new NumArray([-2, 0, 3, -5, 2, -1])\\nsumRange(0, 2) -> returns 1\\nsumRange(2, 5) -> returns -1\\n\\nConstraints:\\n- 1 <= nums.length <= 10^4\\n- -10^5 <= nums[i] <= 10^5\\n- 0 <= left <= right < nums.length',
          bruteExplain: 'For each query, iterate through the array from index `left` to `right` and sum the elements up. This requires loop queries.',
          bruteComplexity: 'Time Complexity: O(N) per query | Space Complexity: O(1)',
          brutePseudocode: 'Step 1: Save array elements in class constructor.\\nStep 2: In sumRange(left, right), loop from left to right, summing elements up.\\nStep 3: Return the calculated sum.',
          bruteOutput: 'Input: nums = [-2, 0, 3, -5, 2, -1], sumRange(0, 2)\\nOutput: 1',
          bruteCpp: `#include <vector>

class NumArray {
private:
    std::vector<int> data;
public:
    NumArray(std::vector<int>& nums) {
        // Save copy of array values
        data = nums;
    }
    
    int sumRange(int left, int right) {
        int sum = 0;
        // Loop from left boundary to right boundary to sum up elements
        for (int i = left; i <= right; i++) {
            sum += data[i]; // Add each element in range
        }
        return sum;
    }
};`,
          bruteJava: `class NumArray {
    private int[] data;
    
    public NumArray(int[] nums) {
        // Save copy of array values
        data = nums;
    }
    
    public int sumRange(int left, int right) {
        int sum = 0;
        // Loop from left boundary to right boundary to sum up elements
        for (int i = left; i <= right; i++) {
            sum += data[i];
        }
        return sum;
    }
}`,
          brutePython: `class NumArray:
    def __init__(self, nums: list[int]):
        # Save copy of array values
        self.data = nums
        
    def sumRange(self, left: int, right: int) -> int:
        val_sum = 0
        # Loop from left boundary to right boundary to sum up elements
        for i in range(left, right + 1):
            val_sum += self.data[i]
        return val_sum`,
          bruteCodeExplain: '1. Store the array reference inside class variable `data`.\\n2. In `sumRange`, start a loop with variable `i` running from `left` index to `right` index.\\n3. Add all elements in the range to calculate the sum. This query runs in O(N) time.',
          optimalExplain: "Precalculate a prefix sum array `prefix` of size `N+1`, where `prefix[i]` stores the sum of the first `i` elements. The sum between query bounds `left` and `right` is computed as `prefix[right + 1] - prefix[left]` in constant time.",
          optimalComplexity: 'Time Complexity: O(1) per query (O(N) setup) | Space Complexity: O(N)',
          optimalPseudocode: 'Step 1: Precompute prefix sums of size N+1. prefix[0] = 0.\\nStep 2: Accumulate elements: prefix[i+1] = prefix[i] + nums[i] for i from 0 to N-1.\\nStep 3: range sum = prefix[right+1] - prefix[left].\\nStep 4: Return result.',
          optimalOutput: 'Input: nums = [-2, 0, 3, -5, 2, -1], sumRange(0, 2)\\nOutput: 1',
          optimalCpp: `#include <vector>

class NumArray {
private:
    std::vector<int> prefix;
public:
    NumArray(std::vector<int>& nums) {
        // Pre-allocate N+1 elements for the prefix sums
        prefix.resize(nums.size() + 1, 0);
        
        // Precompute cumulative totals
        for (int i = 0; i < nums.size(); i++) {
            prefix[i + 1] = prefix[i] + nums[i]; // Precompute sums
        }
    }
    
    int sumRange(int left, int right) {
        // Calculate the range sum instantly
        return prefix[right + 1] - prefix[left]; // Calculate instantly
    }
};`,
          optimalJava: `class NumArray {
    private int[] prefix;
    
    public NumArray(int[] nums) {
        // Precompute prefix sums array
        prefix = new int[nums.length + 1];
        
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }
    
    public int sumRange(int left, int right) {
        // Calculate the range sum instantly
        return prefix[right + 1] - prefix[left];
    }
}`,
          optimalPython: `class NumArray:
    def __init__(self, nums: list[int]):
        # Precompute prefix sums list
        self.prefix = [0] * (len(nums) + 1)
        
        for i in range(len(nums)):
            self.prefix[i + 1] = self.prefix[i] + nums[i]
            
    def sumRange(self, left: int, right: int) -> int:
        # Calculate the range sum instantly
        return self.prefix[right + 1] - self.prefix[left]`,
          optimalCodeExplain: '1. During initialization, we populate the `prefix` array where each slot `i` contains the sum of elements from `0` to `i-1`.\\n2. In `sumRange`, we calculate the sum of elements between `left` and `right` by taking `prefix[right + 1]` and subtracting `prefix[left]`.\\n3. Subtracting the prefix sums removes the contribution of elements before `left`, leaving the exact range sum in constant O(1) time.'
        },
        {
          title: 'Find Pivot Index / Equilibrium Point (LeetCode 724 / GFG)',
          leetcode: 'https://leetcode.com/problems/find-pivot-index/',
          gfg: 'https://www.geeksforgeeks.org/problems/equilibrium-point-1587115620/1',
          questionExplain: 'Find the index where the sum of all elements to the left is equal to the sum of all elements to the right. If no such index exists, return -1.\\n\\nInput: nums = [1, 7, 3, 6, 5, 6]\\nOutput: 3\\n\\nConstraints:\\n- 1 <= nums.length <= 10^4\\n- -1000 <= nums[i] <= 1000',
          bruteExplain: 'For each index i, calculate the sum of elements on its left by looping from 0 to i-1, and calculate the sum of elements on its right by looping from i+1 to N-1. Compare the sums.',
          bruteComplexity: 'Time Complexity: O(N²) | Space Complexity: O(1)',
          brutePseudocode: 'Step 1: Loop index i from 0 to N-1.\\nStep 2: Calculate leftSum = sum(nums[0..i-1]).\\nStep 3: Calculate rightSum = sum(nums[i+1..N-1]).\\nStep 4: If leftSum == rightSum, return i. Else return -1.',
          bruteOutput: 'Input: nums = [1, 7, 3, 6, 5, 6]\\nOutput: 3',
          bruteCpp: `#include <vector>

int pivotIndex(std::vector<int>& nums) {
    int n = nums.size();
    
    // Check each position as a potential pivot index
    for (int i = 0; i < n; i++) {
        int leftSum = 0;
        // Compute left side sum
        for (int j = 0; j < i; j++) {
            leftSum += nums[j];
        }
        
        int rightSum = 0;
        // Compute right side sum
        for (int j = i + 1; j < n; j++) {
            rightSum += nums[j];
        }
        
        // Pivot index found if left and right sums are equal
        if (leftSum == rightSum) {
            return i;
        }
    }
    return -1;
}`,
          bruteJava: `public class Solution {
    public int pivotIndex(int[] nums) {
        int n = nums.length;
        
        // Check each position as a potential pivot index
        for (int i = 0; i < n; i++) {
            int leftSum = 0;
            // Compute left side sum
            for (int j = 0; j < i; j++) {
                leftSum += nums[j];
            }
            
            int rightSum = 0;
            // Compute right side sum
            for (int j = i + 1; j < n; j++) {
                rightSum += nums[j];
            }
            
            // Pivot index found if left and right sums are equal
            if (leftSum == rightSum) {
                return i;
            }
        }
        return -1;
    }
}`,
          brutePython: `def pivotIndex(nums: list[int]) -> int:
    n = len(nums)
    
    # Check each position as a potential pivot index
    for i in range(n):
        # Compute left and right side sums
        left_sum = sum(nums[:i])
        right_sum = sum(nums[i+1:])
        
        # Pivot index found if left and right sums are equal
        if left_sum == right_sum:
            return i
            
    return -1`,
          bruteCodeExplain: '1. Outer loop variable `i` iterates over every possible pivot index from `0` to `N-1`.\\n2. Inner loops calculate the sum of elements strictly to the left (`0` to `i-1`) and strictly to the right (`i+1` to `N-1`).\\n3. If they are equal, return `i` as the pivot index.',
          optimalExplain: 'First, calculate the `totalSum` of the array. Then loop through the array, keeping track of a running `leftSum`. For each element, the sum of elements on its right is `totalSum - leftSum - nums[i]`. If `leftSum == rightSum`, return index. Add current element to `leftSum` for the next check.',
          optimalComplexity: 'Time Complexity: O(N) | Space Complexity: O(1)',
          optimalPseudocode: 'Step 1: Compute totalSum of the array.\\nStep 2: Initialize leftSum = 0.\\nStep 3: Iterate i from 0 to N-1.\\nStep 4: If leftSum == totalSum - leftSum - nums[i], return i. Else, add nums[i] to leftSum.\\nStep 5: Return -1.',
          optimalOutput: 'Input: nums = [1, 7, 3, 6, 5, 6]\\nOutput: 3',
          optimalCpp: `#include <vector>

int pivotIndex(std::vector<int>& nums) {
    int totalSum = 0;
    // Calculate total sum of array in a single pass
    for (int x : nums) {
        totalSum += x;
    }
    
    int leftSum = 0;
    for (int i = 0; i < nums.size(); i++) {
        // Right sum is totalSum - leftSum - currentElement
        if (leftSum == (totalSum - leftSum - nums[i])) {
            return i; // Left sum equals right sum; pivot found
        }
        leftSum += nums[i]; // Update running left sum
    }
    return -1; // No pivot index found
}`,
          optimalJava: `public class Solution {
    public int pivotIndex(int[] nums) {
        int totalSum = 0;
        // Calculate total sum of array in a single pass
        for (int x : nums) {
            totalSum += x;
        }
        
        int leftSum = 0;
        for (int i = 0; i < nums.length; i++) {
            // Right sum is totalSum - leftSum - currentElement
            if (leftSum == (totalSum - leftSum - nums[i])) {
                return i; // Left sum equals right sum; pivot found
            }
            leftSum += nums[i]; // Update running left sum
        }
        return -1; // No pivot index found
    }
}`,
          optimalPython: `def pivotIndex(nums: list[int]) -> int:
    total_sum = sum(nums)
    left_sum = 0
    
    # Check left/right equality in a single sweep
    for i, val in enumerate(nums):
        # Compare running left sum with calculated right sum
        if left_sum == (total_sum - left_sum - val):
            return i
        left_sum += val`,
          optimalCodeExplain: '1. Pre-calculate the total sum of all elements in the array to avoid repeated sweeps.\\n2. Iterate through the array maintaining a running `leftSum`.\\n3. At index `i`, the sum of elements on the right is equal to `totalSum - leftSum - nums[i]`.\\n4. If `leftSum` matches the right sum, return `i` immediately. Else, add the current element to `leftSum` and move to the next index. This runs in O(N) time.'
        }
      ]
    }
  ];

  const getSweepMessage = (problemTitle: string, idx: number, val: string, elements: string[]) => {
    const titleLower = problemTitle.toLowerCase();
    if (titleLower.includes('max')) {
      if (idx === 0) return `Start traversal: Initialize maxVal = ${val} at index 0.`;
      
      // Let's compute historical maxVal
      let maxSoFar = parseInt(elements[0]);
      for (let i = 1; i < idx; i++) {
        const v = parseInt(elements[i]);
        if (v > maxSoFar) maxSoFar = v;
      }
      const currentVal = parseInt(val);
      if (currentVal > maxSoFar) {
        return `Index ${idx}: Found elements[${idx}] = ${val}. It is larger than current max (${maxSoFar}). Update maxVal = ${val}.`;
      } else {
        return `Index ${idx}: Found elements[${idx}] = ${val}. It is less than or equal to current max (${maxSoFar}). Keep maxVal = ${maxSoFar}.`;
      }
    }
    
    if (titleLower.includes('sort') || titleLower.includes('parity')) {
      const v = parseInt(val);
      if (v % 2 === 0) {
        return `Index ${idx}: elements[${idx}] = ${val} is EVEN. Place/swap it towards the front.`;
      } else {
        return `Index ${idx}: elements[${idx}] = ${val} is ODD. Keep/swap it towards the end.`;
      }
    }

    if (titleLower.includes('sum') || titleLower.includes('pivot')) {
      return `Index ${idx}: elements[${idx}] = ${val}. Adding to running prefix calculations.`;
    }

    return `Traversal sweep visiting index ${idx}: elements[${idx}] = ${val}.`;
  };

  const startSweepTrace = (problemTitle: string, elements: string[]) => {
    if (isSweepTracing) return;
    setIsSweepTracing(true);
    setSweepProblemTitle(problemTitle);
    setActiveSweepIdx(0);

    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx < elements.length) {
        setActiveSweepIdx(currentIdx);
      } else {
        clearInterval(interval);
        setActiveSweepIdx(null);
        setIsSweepTracing(false);
      }
    }, 1800);
  };

  const renderHighlightedCode = (code: string, lang: string) => {
    if (!code) return null;

    const escapeHtml = (unsafe: string) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    const lines = code.split('\n');

    return (
      <code className="block font-mono text-[13px] leading-relaxed text-slate-300 select-text w-full">
        {lines.map((line, idx) => {
          let html = escapeHtml(line);

          // 1. Highlight Strings
          html = html.replace(/(&quot;.*?&quot;|&#039;.*?&#039;)/g, '<span class="text-yellow-300 font-medium">$1</span>');

          // 2. Highlight Comments
          if (lang === 'python') {
            html = html.replace(/(#.*)$/g, '<span class="text-emerald-500 font-normal italic">$1</span>');
          } else {
            html = html.replace(/(\/\/.*)$/g, '<span class="text-emerald-500 font-normal italic">$1</span>');
            html = html.replace(/(\/\*.*\*\/)$/g, '<span class="text-emerald-500 font-normal italic">$1</span>');
          }

          // 3. Highlight numbers
          html = html.replace(/\b(\d+)\b/g, '<span class="text-amber-400 font-semibold">$1</span>');

          // 4. Highlight keywords
          const keywords = [
            'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'class', 'import',
            'public', 'private', 'protected', 'void', 'int', 'double', 'float', 'char', 'bool', 'boolean',
            'def', 'import', 'from', 'as', 'in', 'and', 'or', 'not', 'is', 'lambda', 'self',
            'std::vector', 'std::swap', 'std::sort', 'vector', 'int\\[\\]', 'int\\*'
          ];

          keywords.forEach((kw) => {
            const regex = new RegExp(`\\b(${kw})\\b(?![^<]*>)`, 'g');
            html = html.replace(regex, '<span class="text-sky-400 font-bold">$1</span>');
          });

          // Highlight common types/constants
          const typesAndConsts = ['true', 'false', 'null', 'None', 'size_t', 'std', 'cout', 'vector', 'Arrays', 'Math', 'System', 'out', 'println'];
          typesAndConsts.forEach((tc) => {
            const regex = new RegExp(`\\b(${tc})\\b(?![^<]*>)`, 'g');
            html = html.replace(regex, '<span class="text-indigo-300 font-bold">$1</span>');
          });

          return (
            <div 
              key={idx} 
              className="flex hover:bg-slate-800/25 rounded transition-colors w-full group"
            >
              <span className="select-none text-slate-500 text-right pr-3 border-r border-slate-700/50 min-w-[2.5rem] inline-block py-0.5 text-xs">
                {idx + 1}
              </span>
              <span 
                className="pl-3 py-0.5 whitespace-pre flex-1 text-slate-300"
                dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} 
              />
            </div>
          );
        })}
      </code>
    );
  };

  const mapQuestionToProblem = (q: any) => {
    if (!q) return null;
    return {
      title: q.title,
      leetcode: q.leetcode,
      gfg: null,
      questionExplain: q.understand,
      bruteExplain: q.brute,
      optimalExplain: q.thinking + "\n\n" + q.optimal,
      bruteComplexity: q.brute.toLowerCase().includes("o(n^2)") || q.brute.toLowerCase().includes("o(n²)") 
        ? "Time Complexity: O(N²) | Space Complexity: O(1)" 
        : "Time Complexity: O(N) | Space Complexity: O(1)",
      optimalComplexity: q.complexity,
      brutePseudocode: q.brute,
      optimalPseudocode: q.optimal,
      bruteCodeExplain: q.brute,
      optimalCodeExplain: q.thinking,
      bruteOutput: q.complexity,
      optimalOutput: q.complexity,
      bruteCpp: q.bruteCpp || q.cpp,
      bruteJava: q.bruteJava || q.java,
      brutePython: q.brutePython || q.python,
      optimalCpp: q.optimalCpp || q.cpp,
      optimalJava: q.optimalJava || q.java,
      optimalPython: q.optimalPython || q.python,
    };
  };

  const mapFallbackQuestionToProblem = (q: any) => {
    if (!q) return null;
    return {
      title: q.name,
      leetcode: q.leetcode,
      gfg: null,
      questionExplain: q.trace,
      bruteExplain: "See pattern recognition details for brute-force insights.",
      optimalExplain: `Pattern: ${q.pattern}\n\nAlgorithm: ${q.algorithm}\n\nTrace: ${q.trace}`,
      bruteComplexity: "Time Complexity: O(N) | Space Complexity: O(1)",
      optimalComplexity: `Algorithm: ${q.algorithm}`,
      brutePseudocode: q.trace,
      optimalPseudocode: q.trace,
      bruteCodeExplain: q.trace,
      optimalCodeExplain: q.trace,
      bruteOutput: q.algorithm,
      optimalOutput: q.algorithm,
      bruteCpp: q.solution,
      bruteJava: q.solution,
      brutePython: q.solution,
      optimalCpp: q.solution,
      optimalJava: q.solution,
      optimalPython: q.solution,
    };
  };

  const renderFormattedParagraphs = (text: string) => {
    if (!text) return null;
    const cleanText = text.replace(/\\n/g, '\n');
    return cleanText.split('\n').map((para, pIdx) => {
      const trimmed = para.trim();
      if (!trimmed) return null;
      return (
        <p key={pIdx} className="text-xs md:text-sm text-slate-300 font-normal leading-relaxed mb-3 last:mb-0">
          {trimmed}
        </p>
      );
    });
  };

  const renderPseudoSteps = (text: string) => {
    if (!text) return null;
    const cleanText = text.replace(/\\n/g, '\n');
    return cleanText.split('\n').map((step, sIdx) => {
      const trimmed = step.trim();
      if (!trimmed) return null;
      const displayVal = trimmed.replace(/^(Step\s*\d+:|^\d+\.\s*)/i, '').trim();
      return (
        <div key={sIdx} className="flex gap-4 p-4 rounded-xl border border-border/10 bg-black/25 items-start">
          <div className="px-2.5 py-1 rounded bg-primary/10 border border-primary/30 text-primary font-mono text-[10px] font-black shrink-0 uppercase tracking-wider">
            Step {sIdx + 1}
          </div>
          <p className="text-xs md:text-sm text-slate-300 font-normal leading-relaxed">{displayVal}</p>
        </div>
      );
    });
  };

  const renderDryRunPoints = (text: string) => {
    if (!text) return null;
    const cleanText = text.replace(/\\n/g, '\n');
    return cleanText.split('\n').map((line, lIdx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      const displayVal = trimmed.replace(/^(\d+\.\s*|•\s*)/, '').trim();
      return (
        <div key={lIdx} className="flex gap-3 items-start text-xs md:text-sm leading-relaxed mb-2.5 last:mb-0">
          <span className="text-primary font-bold text-lg leading-none mt-0.5">•</span>
          <p className="text-slate-300 font-normal">{displayVal}</p>
        </div>
      );
    });
  };

  const renderArrayDiagram = (text: string, problemTitle: string) => {
    const cleanText = text.replace(/\\n/g, '\n');
    
    // 1. Try to find arrays like [12, 35, 1, 10, 34] or [1, -2, 3]
    const arrayMatch = cleanText.match(/\[([-\d\s,]+)\]/);
    if (arrayMatch) {
      const arrayStr = arrayMatch[1];
      const elements = arrayStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
      if (elements.length > 0 && elements.length <= 15) {
        const isThisTracing = isSweepTracing && sweepProblemTitle === problemTitle;
        return (
          <div className="mt-4 p-5 bg-black/40 border border-border/20 rounded-2xl space-y-4 select-none animate-fadeIn">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-xs font-mono font-black text-primary uppercase tracking-wider block">Input Array Diagram</span>
              <button
                onClick={() => startSweepTrace(problemTitle, elements)}
                disabled={isSweepTracing}
                className={`px-3 py-1 rounded-lg text-[10px] font-mono font-black border transition-all cursor-pointer ${
                  isThisTracing 
                    ? 'bg-secondary/20 border-secondary text-secondary animate-pulse' 
                    : 'bg-[#0F172A]/80 border-border/40 text-text-muted hover:text-white hover:border-primary/50'
                }`}
              >
                {isThisTracing ? "Tracing Traversal..." : "Simulate Traversal Sweep"}
              </button>
            </div>
            
            <div className="flex gap-2.5 py-2.5 overflow-x-auto scrollbar-none items-center justify-start">
              {elements.map((val, idx) => {
                const isActive = activeSweepIdx === idx && sweepProblemTitle === problemTitle;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className={`h-11 w-14 rounded-xl border flex items-center justify-center font-mono text-sm font-black transition-all duration-300 ${
                      isActive 
                        ? 'border-secondary bg-secondary/20 text-white scale-105 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                        : 'border-primary/45 bg-primary/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                    }`}>
                      {val}
                    </div>
                    <span className={`text-[10px] font-mono ${isActive ? 'text-secondary font-black' : 'text-text-muted'}`}>
                      {isActive ? '→ i' : `idx ${idx}`}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Sweep explanation log */}
            {isThisTracing && activeSweepIdx !== null && (
              <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-xl text-xs font-mono text-secondary leading-relaxed animate-fadeIn">
                {getSweepMessage(problemTitle, activeSweepIdx, elements[activeSweepIdx], elements)}
              </div>
            )}
          </div>
        );
      }
    }

    // 2. Try to find strings like s = "leetcode"
    const stringMatch = cleanText.match(/s\s*=\s*["']([^"']+)["']/);
    if (stringMatch) {
      const strVal = stringMatch[1];
      const elements = strVal.split('');
      if (elements.length > 0 && elements.length <= 15) {
        const isThisTracing = isSweepTracing && sweepProblemTitle === problemTitle;
        return (
          <div className="mt-4 p-5 bg-black/40 border border-border/20 rounded-2xl space-y-4 select-none animate-fadeIn">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-xs font-mono font-black text-primary uppercase tracking-wider block">Input String Diagram</span>
              <button
                onClick={() => startSweepTrace(problemTitle, elements)}
                disabled={isSweepTracing}
                className={`px-3 py-1 rounded-lg text-[10px] font-mono font-black border transition-all cursor-pointer ${
                  isThisTracing 
                    ? 'bg-secondary/20 border-secondary text-secondary animate-pulse' 
                    : 'bg-[#0F172A]/80 border-border/40 text-text-muted hover:text-white hover:border-primary/50'
                }`}
              >
                {isThisTracing ? "Tracing Traversal..." : "Simulate Traversal Sweep"}
              </button>
            </div>
            
            <div className="flex gap-2 py-2 overflow-x-auto scrollbar-none items-center justify-start">
              {elements.map((val, idx) => {
                const isActive = activeSweepIdx === idx && sweepProblemTitle === problemTitle;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className={`h-10 w-10 rounded-xl border flex items-center justify-center font-mono text-sm font-black transition-all duration-300 ${
                      isActive 
                        ? 'border-secondary bg-secondary/20 text-white scale-105 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                        : 'border-primary/45 bg-primary/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                    }`}>
                      {val}
                    </div>
                    <span className={`text-[10px] font-mono ${isActive ? 'text-secondary font-black' : 'text-text-muted'}`}>
                      {isActive ? '→ i' : `idx ${idx}`}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Sweep explanation log */}
            {isThisTracing && activeSweepIdx !== null && (
              <div className="p-3 bg-secondary/5 border border-secondary/20 rounded-xl text-xs font-mono text-secondary leading-relaxed animate-fadeIn">
                {getSweepMessage(problemTitle, activeSweepIdx, elements[activeSweepIdx], elements)}
              </div>
            )}
          </div>
        );
      }
    }

    return null;
  };

  const renderProblemWorkspace = (problem: any) => {
    if (!problem) return null;
    
    const isBrute = selectedApproach === 'brute';
    const explanation = isBrute ? problem.bruteExplain : problem.optimalExplain;
    const complexity = isBrute ? problem.bruteComplexity : problem.optimalComplexity;
    const pseudocode = isBrute ? problem.brutePseudocode : problem.optimalPseudocode;
    const codeExplain = isBrute ? problem.bruteCodeExplain : problem.optimalCodeExplain;
    const output = isBrute ? problem.bruteOutput : problem.optimalOutput;
    
    let code = '';
    if (selectedLang === 'cpp') code = isBrute ? problem.bruteCpp : problem.optimalCpp;
    else if (selectedLang === 'java') code = isBrute ? problem.bruteJava : problem.optimalJava;
    else if (selectedLang === 'python') code = isBrute ? problem.brutePython : problem.optimalPython;

    return (
      <div className="space-y-6 bg-card-bg/10 border border-border/20 rounded-[32px] p-5 md:p-8 shadow-2xl relative text-left w-full animate-fadeIn">
        
        {/* Header Problem card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/15">
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-black text-[#FBBF24] uppercase tracking-wider block">Interactive Solved Problem Workspace</span>
            <h4 className="text-base font-black text-white">{problem.title}</h4>
          </div>
          
          <div className="flex items-center gap-3 select-none">
            {problem.leetcode && (
              <a 
                href={problem.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#E4A11B]/10 hover:bg-[#E4A11B]/20 text-[#E4A11B] text-xs font-bold font-mono transition-colors"
              >
                LeetCode
              </a>
            )}
            {problem.gfg && (
              <a 
                href={problem.gfg}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#22C55E] text-xs font-bold font-mono transition-colors"
              >
                GFG
              </a>
            )}
          </div>
        </div>

        {/* Question Text */}
        <div className="text-xs md:text-sm text-text-muted leading-relaxed font-normal bg-black/35 border border-border/20 rounded-2xl p-5">
          <span className="text-[10px] font-mono font-black text-white/50 uppercase tracking-wider block mb-3 select-none">Problem Statement</span>
          {renderFormattedParagraphs(problem.questionExplain)}
          {renderArrayDiagram(problem.questionExplain, problem.title)}
        </div>

        {/* Approach Selector switcher */}
        <div className="flex bg-black/45 border border-border/30 rounded-2xl p-1 max-w-xs select-none">
          <button
            onClick={() => {
              setSelectedApproach('brute');
            }}
            className={`flex-1 py-1.5 text-[11px] font-mono font-black rounded-xl transition-all cursor-pointer ${
              isBrute 
                ? 'bg-[#EF4444] text-white shadow font-black' 
                : 'text-text-muted hover:text-white'
            }`}
          >
            Brute Force
          </button>
          <button
            onClick={() => {
              setSelectedApproach('optimal');
            }}
            className={`flex-1 py-1.5 text-[11px] font-mono font-black rounded-xl transition-all cursor-pointer ${
              !isBrute 
                ? 'bg-[#10B981] text-white shadow font-black' 
                : 'text-text-muted hover:text-white'
            }`}
          >
            Optimal Solution
          </button>
        </div>

        {/* SECTION 1: Strategy, Concept & Pseudo-code (Collapsible Unified Card) */}
        <div className="rounded-[24px] border border-border/30 overflow-hidden bg-[#03070E]/80 shadow-xl animate-fadeIn">
          <button
            onClick={() => setIsStrategyExpanded(!isStrategyExpanded)}
            className="w-full flex items-center justify-between p-5 bg-[#050B15]/90 hover:bg-[#081222]/90 border-b border-border/30 select-none cursor-pointer text-left focus:outline-none transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <Brain className="h-4.5 w-4.5 text-primary" />
              <h5 className="text-sm font-black text-white uppercase tracking-wider font-mono">1. Strategy, Concept & Pseudo-code</h5>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-text-muted font-bold font-mono">
                {isStrategyExpanded ? "Click to collapse" : "Click to expand"}
              </span>
              <div className="relative h-5 w-5 flex items-center justify-center select-none shrink-0 ml-1">
                {/* Horizontal line */}
                <span className={`absolute h-[2px] w-4 bg-primary rounded-full transition-all duration-300 ${
                  isStrategyExpanded ? 'rotate-180' : 'rotate-0'
                }`} />
                {/* Vertical line */}
                <span className={`absolute h-4 w-[2px] bg-primary rounded-full transition-all duration-300 ${
                  isStrategyExpanded ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                }`} />
              </div>
            </div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: isStrategyExpanded ? "auto" : 0,
              opacity: isStrategyExpanded ? 1 : 0
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 md:p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 select-none">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-mono font-black text-text-muted uppercase tracking-wider block">Methodology & Idea</span>
                </div>
                <div className="space-y-2">
                  {renderFormattedParagraphs(explanation)}
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-border/20 rounded-2xl flex justify-between items-center text-xs font-mono font-bold select-none">
                <span className="text-text-muted">Target Complexity:</span>
                <span className={`font-black text-[11px] px-2.5 py-1 rounded-lg bg-black/40 border border-border/30 ${isBrute ? "text-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.2)]"}`}>
                  {complexity}
                </span>
              </div>

              {/* Pointwise Pseudo-code Steps inside the same card */}
              <div className="border-t border-border/20 pt-6 space-y-4">
                <div className="flex items-center gap-2 select-none">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-mono font-black text-text-muted uppercase tracking-wider block">Pointwise Pseudo-code Steps</span>
                </div>
                <div className="flex flex-col gap-4">
                  {renderPseudoSteps(pseudocode)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SECTION 2: Code Implementation (Collapsible Panel with custom cross toggle) */}
        <div className="rounded-[24px] border border-border/30 overflow-hidden bg-[#03070E]/80 shadow-xl animate-fadeIn">
          <button
            onClick={() => setIsCodeExpanded(!isCodeExpanded)}
            className="w-full flex items-center justify-between p-5 bg-[#050B15]/90 hover:bg-[#081222]/90 border-b border-border/30 select-none cursor-pointer text-left focus:outline-none transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <Terminal className="h-4.5 w-4.5 text-primary" />
              <h5 className="text-sm font-black text-white uppercase tracking-wider font-mono">2. Code Solution & Implementation</h5>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-text-muted font-bold font-mono">
                {isCodeExpanded ? "Click to collapse" : "Click to expand"}
              </span>
              <div className="relative h-5 w-5 flex items-center justify-center select-none shrink-0 ml-1">
                {/* Horizontal line */}
                <span className={`absolute h-[2px] w-4 bg-primary rounded-full transition-all duration-300 ${
                  isCodeExpanded ? 'rotate-180' : 'rotate-0'
                }`} />
                {/* Vertical line */}
                <span className={`absolute h-4 w-[2px] bg-primary rounded-full transition-all duration-300 ${
                  isCodeExpanded ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                }`} />
              </div>
            </div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: isCodeExpanded ? "auto" : 0,
              opacity: isCodeExpanded ? 1 : 0
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center bg-[#050B15]/80 border border-border/30 rounded-2xl p-4 flex-wrap gap-4 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#EF4444]" />
                  <span className="h-3 w-3 rounded-full bg-[#F59E0B]" />
                  <span className="h-3 w-3 rounded-full bg-[#22C55E]" />
                  <span className="text-xs text-text-muted font-mono font-bold ml-2">Interactive Code Editor</span>
                </div>
                
                {/* Language Switcher */}
                <div className="flex rounded-xl border border-border/60 overflow-hidden bg-black/40 p-0.5">
                  {[
                    { id: 'cpp', label: 'C++' },
                    { id: 'java', label: 'Java' },
                    { id: 'python', label: 'Python' }
                  ].map((lang) => {
                    const isActive = selectedLang === lang.id;
                    return (
                      <button
                        key={lang.id}
                        onClick={() => setSelectedLang(lang.id as any)}
                        className={`px-3 py-1.5 text-xs font-mono font-bold cursor-pointer rounded-lg transition-all ${
                          isActive 
                            ? 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow font-black' 
                            : 'text-text-muted hover:text-white'
                        }`}
                      >
                        {lang.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-border/30 overflow-hidden bg-[#03070E] shadow-xl p-0 relative min-h-[260px]">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    setCopiedCode(code);
                    setTimeout(() => setCopiedCode(null), 2000);
                  }}
                  className="absolute top-4 right-4 p-2.5 rounded-xl border border-border bg-black/60 text-text-muted hover:text-white transition-colors cursor-pointer select-none z-10"
                  title="Copy code"
                >
                  {copiedCode === code ? <Check className="h-4.5 w-4.5 text-success" /> : <Copy className="h-4.5 w-4.5" />}
                </button>
                
                <pre className="p-5 overflow-x-auto bg-[#03070E]">
                  {renderHighlightedCode(code, selectedLang)}
                </pre>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SECTION 3: Dry Run & Expected Output (Collapsible Panel) */}
        <div className="rounded-[24px] border border-border/30 overflow-hidden bg-[#03070E]/80 shadow-xl animate-fadeIn">
          <button
            onClick={() => setIsDryRunExpanded(!isDryRunExpanded)}
            className="w-full flex items-center justify-between p-5 bg-[#050B15]/90 hover:bg-[#081222]/90 border-b border-border/30 select-none cursor-pointer text-left focus:outline-none transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <Play className="h-4.5 w-4.5 text-[#10B981]" />
              <h5 className="text-sm font-black text-white uppercase tracking-wider font-mono">3. Dry Run & Execution Trace</h5>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-bold font-mono">
                {isDryRunExpanded ? "Click to collapse" : "Click to expand"}
              </span>
              <div className="relative h-5 w-5 flex items-center justify-center select-none shrink-0 ml-1">
                {/* Horizontal line */}
                <span className={`absolute h-[2px] w-4 bg-primary rounded-full transition-all duration-300 ${
                  isDryRunExpanded ? 'rotate-180' : 'rotate-0'
                }`} />
                {/* Vertical line */}
                <span className={`absolute h-4 w-[2px] bg-primary rounded-full transition-all duration-300 ${
                  isDryRunExpanded ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                }`} />
              </div>
            </div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: isDryRunExpanded ? "auto" : 0,
              opacity: isDryRunExpanded ? 1 : 0
            }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Line-by-Line logic breakdown */}
                <div className="lg:col-span-7 p-5 rounded-2xl border border-border/30 bg-card-bg/25 space-y-3">
                  <span className="text-[10px] font-mono font-black text-text-muted uppercase tracking-wider block select-none">Line-by-Line Execution Breakdown</span>
                  <div className="space-y-3">
                    {renderDryRunPoints(codeExplain)}
                  </div>
                </div>

                {/* Right Column: expected Terminal Output */}
                <div className="lg:col-span-5 rounded-2xl border border-border/30 overflow-hidden bg-[#02050B] p-5 flex flex-col gap-3 font-mono">
                  <div className="flex items-center gap-1.5 text-text-muted uppercase text-[10px] font-black tracking-wider pb-2.5 border-b border-border/20 select-none">
                    <Terminal className="h-4 w-4 text-[#10B981]" />
                    <span>Expected Terminal Output</span>
                  </div>
                  <pre className="text-slate-300 select-text whitespace-pre-wrap font-mono leading-relaxed bg-transparent p-2 text-xs">
                    {output.replace(/\\n/g, '\n')}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    );
  };

  const [twoPointerL, setTwoPointerL] = useState(0);
  const [twoPointerR, setTwoPointerR] = useState(4);
  const [twoPointerSum, setTwoPointerSum] = useState(6);
  const [twoPointerTarget, setTwoPointerTarget] = useState(5);
  const [twoPointerStatus, setTwoPointerStatus] = useState('Click "Play Animation" to trace pointers.');
  const [twoPointerPlaying, setTwoPointerPlaying] = useState(false);

  // Custom sliding window animation state
  const [windowStart, setWindowStart] = useState(0);
  const [windowEnd, setWindowEnd] = useState(2);
  const [windowSum, setWindowSum] = useState(8);
  const [windowMax, setWindowMax] = useState(8);
  const [windowStatus, setWindowStatus] = useState('Click "Play Animation" to slide window.');
  const [windowPlaying, setWindowPlaying] = useState(false);

  // Visualize Panel Animation States
  const [animatingMode, setAnimatingMode] = useState<'none' | 'traversal' | 'insert' | 'delete' | 'access' | 'update'>('none');
  const [animationStep, setAnimationStep] = useState(0);
  const [arrayElements, setArrayElements] = useState<number[]>([10, 20, 30, 40]);
  const [activePointer, setActivePointer] = useState<number | null>(null);
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [animationText, setAnimationText] = useState('Interactive Sandbox. Click an animation below to begin.');

  const loadTopicDetails = async () => {
    try {
      const res = await apiClient(`/roadmaps/dsa/topics/${slug}`);
      if (res.success && res.topic) {
        setTopic(res.topic);
        setIsCompleted(res.isCompleted || false);
        setArrayElements(res.topic.visualize.initialData || [10, 20, 30, 40]);
      }
    } catch (err) {
      console.error('Failed to load DSA topic details:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && slug) {
      loadTopicDetails();
      if (slug === 'arrays') {
        setActiveTab('fundamentals');
      } else {
        setActiveTab('understand');
      }
    }
  }, [isAuthenticated, slug]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  // AI Feature 1: Explain Simpler
  const handleExplainSimpler = async () => {
    if (!topic) return;
    setSimplifying(true);
    try {
      const res = await apiClient(`/roadmaps/dsa/topics/${slug}/ai`, {
        method: 'POST',
        body: JSON.stringify({ action: 'explain-simpler' })
      });
      if (res.success && res.result) {
        setSimplerExplanation(res.result);
      }
    } catch (err) {
      console.error('Explain Simpler AI failed:', err);
    } finally {
      setSimplifying(false);
    }
  };

  // AI Feature 2: Another Example
  const handleAnotherExample = async () => {
    if (!topic) return;
    setGeneratingAnalogy(true);
    try {
      const res = await apiClient(`/roadmaps/dsa/topics/${slug}/ai`, {
        method: 'POST',
        body: JSON.stringify({ action: 'another-example' })
      });
      if (res.success && res.result) {
        setCustomAnalogy(res.result);
      }
    } catch (err) {
      console.error('Another Analogy AI failed:', err);
    } finally {
      setGeneratingAnalogy(false);
    }
  };

  // AI Feature 3: Quiz Me
  const handleQuizMe = async () => {
    if (!topic) return;
    setQuizzing(true);
    setQuizError(null);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    try {
      const res = await apiClient(`/roadmaps/dsa/topics/${slug}/ai`, {
        method: 'POST',
        body: JSON.stringify({ action: 'quiz-me' })
      });
      if (res.success && res.result) {
        setQuizQuestions(res.result);
        setQuizOpen(true);
      }
    } catch (err) {
      console.error('Quiz Me AI failed:', err);
    } finally {
      setQuizzing(false);
    }
  };

  const handleVerifyQuiz = () => {
    if (!quizQuestions) return;
    if (Object.keys(selectedAnswers).length < quizQuestions.length) {
      setQuizError('Please answer all 3 questions.');
      return;
    }

    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);
    if (score < quizQuestions.length) {
      setQuizError('Some answers are incorrect. Review the concept and try again!');
    } else {
      setQuizError(null);
    }
  };

  // Topic Completion Checkpoint
  const handleCompleteTopic = async () => {
    try {
      const res = await apiClient(`/roadmaps/dsa/topics/${slug}/complete`, {
        method: 'POST'
      });
      if (res.success) {
        setIsCompleted(true);
        if (user) {
          const updatedCompleted = user.completedLessons ? [...user.completedLessons] : [];
          const topicKey = `dsa-topic/${slug}`;
          if (!updatedCompleted.includes(topicKey)) {
            updatedCompleted.push(topicKey);
          }
          setUser({
            ...user,
            xp: res.xp,
            streak: res.streak,
            completedLessons: updatedCompleted
          });
        }
        router.push('/dsa');
      }
    } catch (err) {
      console.error('Failed to complete topic:', err);
    }
  };

  // Traversal Animation Execution Loop
  const playTraversal = () => {
    setAnimatingMode('traversal');
    setAnimationStep(0);
    setActivePointer(0);
    setHighlightedIndices([]);
    setAnimationText('Traversal Init: Pointer starts at index 0.');

    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < arrayElements.length) {
        setActivePointer(idx);
        setAnimationText(`Reading element at index ${idx}. Value = ${arrayElements[idx]}.`);
      } else {
        clearInterval(interval);
        setActivePointer(null);
        setAnimatingMode('none');
        setAnimationText('Traversal Complete! Checked all elements sequentially.');
      }
    }, 1200);
  };

  // Insertion Animation Execution Loop
  const playInsertion = () => {
    setAnimatingMode('insert');
    setArrayElements([10, 20, 40]);
    setHighlightedIndices([]);
    setActivePointer(null);
    setAnimationText('Inserting 30 at index 2. Initial Array: [10, 20, 40].');

    setTimeout(() => {
      // Step 1: Highlight elements to shift
      setHighlightedIndices([2]);
      setAnimationText('Step 1: Element at index 2 (value 40) must be shifted right to create room.');
    }, 1500);

    setTimeout(() => {
      // Step 2: Show empty slot / shift representation
      setArrayElements([10, 20, 40, 40]);
      setHighlightedIndices([3]);
      setAnimationText('Step 2: Element 40 shifted to index 3.');
    }, 3200);

    setTimeout(() => {
      // Step 3: Insert value
      setArrayElements([10, 20, 30, 40]);
      setHighlightedIndices([2]);
      setAnimationText('Step 3: Inserted value 30 into index 2. Complete!');
    }, 4800);

    setTimeout(() => {
      setHighlightedIndices([]);
      setAnimatingMode('none');
    }, 6000);
  };

  // Deletion Animation Execution Loop
  const playDeletion = () => {
    setAnimatingMode('delete');
    setArrayElements([10, 20, 30, 40]);
    setHighlightedIndices([]);
    setActivePointer(null);
    setAnimationText('Deleting 20 at index 1. Initial Array: [10, 20, 30, 40].');

    setTimeout(() => {
      // Step 1: Highlight deletion cell
      setHighlightedIndices([1]);
      setAnimationText('Step 1: Locate index 1 (value 20) and clear it.');
    }, 1500);

    setTimeout(() => {
      // Step 2: Show shifting of remaining
      setArrayElements([10, 30, 30, 40]);
      setHighlightedIndices([1, 2]);
      setAnimationText('Step 2: Shift element 30 from index 2 left to index 1.');
    }, 3200);

    setTimeout(() => {
      // Step 3: Shift remaining
      setArrayElements([10, 30, 40, 40]);
      setHighlightedIndices([2, 3]);
      setAnimationText('Step 3: Shift element 40 from index 3 left to index 2.');
    }, 4800);

    setTimeout(() => {
      // Step 4: Finalize
      setArrayElements([10, 30, 40]);
      setHighlightedIndices([]);
      setAnimationText('Step 4: Truncate array length to 3. Deletion Complete!');
    }, 6400);

    setTimeout(() => {
      setAnimatingMode('none');
    }, 7600);
  };

  // Access by Index Animation Loop
  const playAccess = (targetIdx: number) => {
    if (animatingMode !== 'none') return;
    setAnimatingMode('access');
    setActivePointer(null);
    setHighlightedIndices([]);
    setAnimationText(`Accessing index ${targetIdx}. Math: Address = BaseAddress + index (${targetIdx}) * ElementSize.`);
    
    setTimeout(() => {
      setActivePointer(targetIdx);
      setHighlightedIndices([targetIdx]);
      setAnimationText(`Index ${targetIdx} accessed directly in O(1) time! Value = ${arrayElements[targetIdx]}.`);
    }, 1200);

    setTimeout(() => {
      setAnimatingMode('none');
    }, 3000);
  };

  // Direct Update Animation Loop
  const playUpdate = (targetIdx: number, newValue: number) => {
    if (animatingMode !== 'none') return;
    setAnimatingMode('update');
    setActivePointer(targetIdx);
    setHighlightedIndices([targetIdx]);
    setAnimationText(`Updating element at index ${targetIdx} to ${newValue}. Direct index overwrite.`);
    
    setTimeout(() => {
      const copy = [...arrayElements];
      copy[targetIdx] = newValue;
      setArrayElements(copy);
      setAnimationText(`Update complete! Array[index ${targetIdx}] is now ${newValue}. Time Complexity: O(1).`);
    }, 1500);

    setTimeout(() => {
      setActivePointer(null);
      setHighlightedIndices([]);
      setAnimatingMode('none');
    }, 3200);
  };

  // Two Pointer Simulation loop
  const playTwoPointer = () => {
    if (twoPointerPlaying) return;
    setTwoPointerPlaying(true);
    setTwoPointerL(0);
    setTwoPointerR(4);
    setTwoPointerSum(6);
    setTwoPointerStatus('L starts at index 0 (val 1), R starts at index 4 (val 5). Sum = 1 + 5 = 6. Target = 5.');

    setTimeout(() => {
      setTwoPointerStatus('Sum (6) > Target (5). Decreasing sum by moving Right pointer left: R = index 3 (val 4).');
      setTwoPointerR(3);
      setTwoPointerSum(5);
    }, 2500);

    setTimeout(() => {
      setTwoPointerStatus('Sum (5) matches Target (5)! Pair found at indices [0, 3] (values 1, 4).');
      setTwoPointerPlaying(false);
    }, 5000);
  };

  // Sliding Window Simulation loop
  const playSlidingWindow = () => {
    if (windowPlaying) return;
    setWindowPlaying(true);
    setWindowStart(0);
    setWindowEnd(2);
    setWindowSum(8);
    setWindowMax(8);
    setWindowStatus('Initial window [0..2] over [2, 1, 5]: Sum = 8. Max Sum = 8.');

    setTimeout(() => {
      setWindowStart(1);
      setWindowEnd(3);
      setWindowSum(7);
      setWindowStatus('Slide window to [1..3] over [1, 5, 1]: Sum = 7. Max Sum remains 8.');
    }, 2200);

    setTimeout(() => {
      setWindowStart(2);
      setWindowEnd(4);
      setWindowSum(9);
      setWindowMax(9);
      setWindowStatus('Slide window to [2..4] over [5, 1, 3]: Sum = 9. Max Sum updated to 9!');
    }, 4400);

    setTimeout(() => {
      setWindowStart(3);
      setWindowEnd(5);
      setWindowSum(6);
      setWindowStatus('Slide window to [3..5] over [1, 3, 2]: Sum = 6. Slide complete. Max Sum = 9!');
      setWindowPlaying(false);
    }, 6600);
  };

  if (isLoading || fetching || !topic) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-text-muted select-none">Retrieving subject details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background text-foreground p-6 relative overflow-hidden font-geist">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Inter:wght@100..900&display=swap');
        .font-geist {
          font-family: 'Geist', 'Inter', sans-serif;
        }
      `}} />
      {/* Background glowing decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[250px] w-full max-w-[1400px] rounded-full bg-primary/5 blur-3xl opacity-60" />

      <div className="max-w-[1400px] ml-0 mr-auto w-full px-4 md:px-8 space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex justify-between items-center gap-4 border-b border-border/40 pb-4 select-none">
          <Link href="/dsa" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-white font-bold cursor-pointer">
            <ChevronLeft className="h-4 w-4" />
            <span>Connected Roadmap</span>
          </Link>

          <div className="flex items-center gap-2">
            {isCompleted ? (
              <span className="px-2.5 py-1 rounded bg-success/15 border border-success/30 text-success text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> Completed
              </span>
            ) : (
              <button 
                onClick={handleCompleteTopic}
                className="px-2.5 py-1 rounded bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Award className="h-3.5 w-3.5 animate-pulse" /> Mark Completed (+100 XP)
              </button>
            )}
          </div>
        </div>

        {/* Header Topic Title & AI actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
          <div>
            <span className="text-[10px] font-black text-primary tracking-wider uppercase font-mono">{topic.difficulty} Concept</span>
            <h1 className="text-3xl font-black text-white mt-1">{topic.name}</h1>
          </div>

          {/* Core AI prompt triggers (No chatbot overlay) */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-[10px] h-8 gap-1.5 font-bold border border-border/80 text-foreground hover:bg-card-bg/50 cursor-pointer"
              onClick={handleExplainSimpler}
              isLoading={simplifying}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Explain Simpler</span>
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-[10px] h-8 gap-1.5 font-bold border border-border/80 text-foreground hover:bg-card-bg/50 cursor-pointer"
              onClick={handleAnotherExample}
              isLoading={generatingAnalogy}
            >
              <RefreshCw className="h-3.5 w-3.5 text-secondary" />
              <span>Another Example</span>
            </Button>
            <Button 
              size="sm" 
              className="text-[10px] h-8 gap-1.5 font-bold bg-primary text-white hover:bg-primary-hover cursor-pointer"
              onClick={handleQuizMe}
              isLoading={quizzing}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Quiz Me</span>
            </Button>
          </div>
        </div>

        {/* Sidebar Toggle Button & Responsive Grid layout */}
        <div className="mb-4 flex items-center justify-between select-none">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/60 bg-[#0F172A]/30 text-[10px] font-mono font-bold text-text-muted hover:text-white transition-all cursor-pointer hover:border-primary/50"
          >
            {isSidebarOpen ? (
              <>
                <ChevronLeft className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span>Collapse Chapters Sidebar</span>
              </>
            ) : (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span>Expand Chapters Sidebar</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
          
          {/* Sticky Left Sidebar panel */}
          <aside className={`shrink-0 bg-[#0F172A]/40 overflow-y-auto max-h-[85vh] select-none transition-all duration-300 ${
            isSidebarOpen 
              ? 'w-full lg:w-60 border border-border/30 rounded-[20px] p-4 lg:sticky lg:top-6 opacity-100' 
              : 'w-0 h-0 lg:w-0 lg:h-0 border-0 p-0 opacity-0 pointer-events-none'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-text-muted uppercase tracking-wider">Chapters</span>
              </div>
              
              <nav className="flex flex-col gap-1.5">
                {(slug === 'arrays'
                  ? [
                      { id: 'fundamentals', label: '1. Fundamentals', color: '#3B82F6', icon: BookOpen,
                        subheadings: [
                          { label: 'What is an Array?', target: 'what-is-array' },
                          { label: 'Why Do We Need Arrays?', target: 'why-array' },
                          { label: 'Creating & Accessing', target: 'creating-accessing' },
                          { label: 'Key Characteristics', target: 'key-characteristics' },
                          { label: 'When to Use', target: 'when-to-use' }
                        ]
                      },
                      { id: 'visualize', label: '2. Visualize', color: '#8B5CF6', icon: Play,
                        subheadings: [
                          { label: 'Interactive Sandbox', target: 'visual-sandbox' },
                          { label: 'Animation Controls', target: 'animation-sandbox' }
                        ]
                      },
                      { id: 'patterns', label: '3. Patterns', color: '#F59E0B', icon: Layers,
                        subheadings: [
                          { label: 'Traversal Sweep', index: 0 },
                          { label: 'Two Pointers', index: 1 },
                          { label: 'Sliding Window', index: 2 },
                          { label: 'Prefix Sum', index: 3 }
                        ]
                      },
                      { id: 'algorithms', label: '4. Algorithms', color: '#10B981', icon: Compass,
                        subheadings: [
                          { label: 'Linear Search', index: 0 },
                          { label: 'Binary Search', index: 1 },
                          { label: 'Kadane\'s', index: 2 },
                          { label: 'Dutch National Flag', index: 3 },
                          { label: 'Prefix Sum Tech', index: 4 }
                        ]
                      },
                      { id: 'questions', label: '5. Interview Questions', color: '#EF4444', icon: HelpCircle,
                        subheadings: [
                          { label: 'Find Maximum', index: 0 },
                          { label: 'Two Sum', index: 1 },
                          { label: 'Max Subarray Sum', index: 2 },
                          { label: 'Range Sum Query', index: 3 },
                          { label: 'Search in Sorted', index: 4 }
                        ]
                      },
                      { id: 'revision', label: '6. Revision Notes', color: '#06B6D4', icon: Award,
                        subheadings: [
                          { label: 'Key Takeaways', target: 'a1-printable-worksheet' },
                          { label: 'Key Properties', target: 'key-properties' },
                          { label: 'Time & Space Complexity', target: 'complexity-table' }
                        ]
                      }
                    ]
                  : [
                      { id: 'understand', label: '1. Understand', color: '#3B82F6', icon: BookOpen, subheadings: [] },
                      { id: 'visualize', label: '2. Visualize', color: '#8B5CF6', icon: Play, subheadings: [] },
                      { id: 'patterns', label: '3. Patterns & Algorithms', color: '#F59E0B', icon: Layers, subheadings: [] },
                      { id: 'questions', label: '4. Questions', color: '#EF4444', icon: HelpCircle, subheadings: [] },
                      { id: 'revise', label: '5. Revise', color: '#06B6D4', icon: Award, subheadings: [] }
                    ]
                ).map((chapter) => {
                  const isChapterActive = activeTab === chapter.id && !quizOpen;
                  const Icon = chapter.icon;
                  return (
                    <div key={chapter.id} className="space-y-1">
                      <button
                        onClick={() => {
                          setActiveTab(chapter.id as any);
                          setQuizOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-[13px] font-bold transition-all cursor-pointer ${
                          isChapterActive 
                            ? 'bg-gradient-to-r from-primary/10 to-indigo-950/25 border border-primary/30 text-white font-black' 
                            : 'border border-transparent text-text-muted hover:text-white hover:bg-slate-800/20'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" style={{ color: chapter.color }} />
                        <span>{chapter.label}</span>
                      </button>
                      
                      {/* Subheadings */}
                      {isSidebarOpen && isChapterActive && slug === 'arrays' && chapter.subheadings.length > 0 && (
                        <div className="pl-9 flex flex-col gap-1 border-l border-border/30 ml-5 py-1">
                          {chapter.subheadings.map((sub, sIdx) => {
                            let isActiveSub = false;
                            if ('index' in sub) {
                              if (chapter.id === 'patterns') isActiveSub = activePatternIndex === sub.index;
                              else if (chapter.id === 'algorithms') isActiveSub = activeAlgIndex === sub.index;
                              else if (chapter.id === 'questions') isActiveSub = activeQuestionIndex === sub.index;
                            }
                            
                            return (
                              <button
                                key={sIdx}
                                onClick={() => {
                                  if ('target' in sub) {
                                    setActiveTab(chapter.id as any);
                                    setQuizOpen(false);
                                    setTimeout(() => {
                                      const el = document.getElementById(sub.target!);
                                      if (el) {
                                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                      }
                                    }, 100);
                                  } else if ('index' in sub) {
                                    setActiveTab(chapter.id as any);
                                    setQuizOpen(false);
                                    if (chapter.id === 'patterns') {
                                      setActivePatternIndex(sub.index!);
                                      setActivePatternProblemIndex(0);
                                    } else if (chapter.id === 'algorithms') {
                                      setActiveAlgIndex(sub.index!);
                                      setActiveAlgProblemIndex(0);
                                    } else if (chapter.id === 'questions') {
                                      setActiveQuestionIndex(sub.index!);
                                    }
                                  }
                                }}
                                className={`text-left text-xs font-semibold py-1 transition-all cursor-pointer block ${
                                  isActiveSub 
                                    ? 'text-white font-bold' 
                                    : 'text-text-muted hover:text-white'
                                }`}
                              >
                                {sub.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 min-h-[300px]">
          
          {/* AI QUIZ OVERLAY TAB STATE */}
          {quizOpen && quizQuestions && (
            <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="flex justify-between items-center flex-row">
                <div>
                  <CardTitle className="text-sm font-black text-white">AI Concept Check</CardTitle>
                  <CardDescription>Answer these 3 custom questions to test your knowledge.</CardDescription>
                </div>
                <button 
                  onClick={() => setQuizOpen(false)}
                  className="text-xs text-text-muted hover:text-white font-bold"
                >
                  Close Quiz
                </button>
              </CardHeader>
              <CardBody className="p-6 space-y-6">
                {quizError && (
                  <div className="p-3.5 rounded-lg border border-warning/20 bg-warning/10 text-warning text-xs font-semibold flex items-center gap-2 select-none">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                    <span>{quizError}</span>
                  </div>
                )}

                <div className="space-y-6">
                  {quizQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2.5 text-xs font-semibold">
                      <p className="text-white text-xs font-bold">{qIdx + 1}. {q.question}</p>
                      <div className="flex flex-col gap-2 pt-1">
                        {q.options.map((opt) => {
                          const isChecked = selectedAnswers[qIdx] === opt;
                          return (
                            <label 
                              key={opt}
                              className={`p-3 rounded-lg border flex items-center gap-3 transition-colors cursor-pointer ${
                                isChecked ? 'border-primary bg-primary/5 text-white' : 'border-border/60 hover:bg-card-bg/30 text-text-muted'
                              }`}
                            >
                              <input 
                                type="radio" 
                                name={`dsa-q-${qIdx}`}
                                value={opt}
                                checked={isChecked}
                                onChange={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: opt }))}
                                disabled={quizSubmitted}
                                className="h-4 w-4 border-border text-primary accent-primary"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  {quizSubmitted ? (
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-white">Score: {quizScore} / 3 Correct</span>
                      <Button variant="outline" size="sm" onClick={handleQuizMe}>
                        Try Another
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleVerifyQuiz}>
                      Submit Answers
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {!quizOpen && (
            slug === 'arrays' ? (
              <>
                {/* SECTION 1: FUNDAMENTALS */}
                {activeTab === 'fundamentals' && (
                  <div className="space-y-16 py-2 animate-fadeIn border-l-4 border-l-[#3B82F6] pl-6 font-geist">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-[10px] font-mono font-bold select-none uppercase tracking-wider">
                        <BookOpen className="h-3 w-3" />
                        <span>Section 1: Fundamentals</span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Array Fundamentals</h3>
                      <p className="text-xs text-text-muted font-normal">Learn the standard definition, logical scaling necessity, structural characteristics, and code templates.</p>
                    </div>

                    {/* SECTION 1: WHAT IS AN ARRAY? */}
                    <div id="what-is-array" className="space-y-8">
                      <Card className="bg-gradient-to-br from-[#0F172A] to-[#030712] border border-[#3B82F6]/30 rounded-[20px] shadow-[0_0_30px_rgba(59,130,246,0.12)] relative overflow-hidden hover:border-[#3B82F6]/50 transition-all duration-300">
                        <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
                        <CardBody className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            {/* Left Side: Definition */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6]">
                                  <Layers className="h-4.5 w-4.5" />
                                </div>
                                <h4 className="text-base font-black text-white tracking-tight">What is an Array?</h4>
                              </div>
                              <div className="space-y-3 text-xs text-text-muted leading-relaxed font-normal">
                                <p className="text-white font-bold text-sm">
                                  An Array is a linear data structure used to store multiple elements of the same data type in a contiguous sequence of memory locations. Each element is identified by an index, allowing fast and direct access to the stored data.
                                </p>
                                <p>
                                  Arrays are one of the most fundamental data structures in computer science and are widely used in software development, competitive programming, and technical interviews.
                                </p>
                              </div>
                            </div>

                            {/* Right Side: Visual Diagram with Floating Animation */}
                            <div className="flex flex-col items-center justify-center p-6 rounded-[20px] bg-black/40 border border-[#3B82F6]/20 min-h-[140px] shadow-inner">
                              <motion.div 
                                className="space-y-3 w-full flex flex-col items-center"
                                animate={{ y: [0, -6, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                              >
                                <span className="text-[10px] font-mono font-black text-primary tracking-wider uppercase">Visual Diagram</span>
                                <div className="flex items-center gap-2 select-none">
                                  {[10, 20, 30, 40].map((val, idx) => (
                                    <div key={idx} className="flex flex-col items-center">
                                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary flex items-center justify-center text-white font-mono font-black text-xs shadow-md shadow-primary/5">
                                        {val}
                                      </div>
                                      <span className="text-[9px] font-mono text-text-muted mt-1.5 font-bold">{idx}</span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </div>

                    {/* SECTION 2: WHY DO WE NEED ARRAYS? */}
                    <div id="why-array" className="space-y-8">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-[#EF4444] uppercase font-mono tracking-wider">Why Do We Need Arrays?</h4>
                        <p className="text-xs text-text-muted font-normal">A side-by-side logical comparison of managing variables manually vs. grouping them inside an Array.</p>
                      </div>
                      
                      <Card className="border border-[#3B82F6]/20 bg-gradient-to-br from-[#0F172A] to-[#030712] rounded-[20px] overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.08)] hover:border-[#3B82F6]/40 transition-all duration-300">
                        <CardBody className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Left Side: Without Array (Red Theme) */}
                            <motion.div 
                              className="p-5 rounded-2xl border border-[#EF4444]/30 bg-[#EF4444]/10 flex flex-col justify-between min-h-[180px] hover:border-[#EF4444]/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.05)] transition-all duration-300"
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[#EF4444]">
                                  <AlertCircle className="h-4.5 w-4.5" />
                                  <span className="text-[10px] font-mono font-black uppercase tracking-wider">Without Array</span>
                                </div>
                                <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                                  Declaring individual variables scales poorly. If you need to store marks for 10,000 students, you would have to write 10,000 unique variable names:
                                </p>
                                <pre className="p-3 bg-black/40 rounded-lg border border-[#EF4444]/10 text-xs font-mono text-text-muted/90 select-none">
{`student1 = 80
student2 = 90
student3 = 75
student4 = 60
student5 = 85`}
                                </pre>
                              </div>
                              <span className="text-[9px] text-[#EF4444]/80 font-mono mt-3 block">✕ Tedious, static, and impossible to traverse dynamically.</span>
                            </motion.div>

                            {/* Right Side: Using Array (Green Theme) */}
                            <motion.div 
                              className="p-5 rounded-2xl border border-[#22C55E]/30 bg-[#22C55E]/10 flex flex-col justify-between min-h-[180px] hover:border-[#22C55E]/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.08)] transition-all duration-300"
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="space-y-3">
                                <div className="flex items-center gap-2 text-[#22C55E]">
                                  <CheckCircle className="h-4.5 w-4.5" />
                                  <span className="text-[10px] font-mono font-black uppercase tracking-wider">Using Array</span>
                                </div>
                                <p className="text-[11px] text-text-muted leading-relaxed font-medium">
                                  Storing similar values under a single identifier provides unified tracking. You can allocate, update, and search items instantly in a structured format:
                                </p>
                                <pre className="p-3 bg-black/40 rounded-lg border border-[#22C55E]/10 text-xs font-mono text-[#22C55E] font-bold select-none">
{`marks = [80, 90, 75, 60, 85]`}
                                </pre>
                              </div>
                              <span className="text-[9px] text-[#22C55E]/80 font-mono mt-3 block">✓ Logical grouping, loops-compatible, and dynamically scalable.</span>
                            </motion.div>

                          </div>
                        </CardBody>
                      </Card>
                    </div>

                    {/* SECTION 4: CODE EXAMPLES */}
                    <div id="creating-accessing" className="space-y-8">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-primary uppercase font-mono tracking-wider">Creating & Accessing Arrays</h4>
                        <p className="text-xs text-text-muted font-normal">Explore syntax configurations and element access examples across multiple programming environments.</p>
                      </div>

                      <Card className="bg-gradient-to-br from-[#0F172A] to-[#030712] border border-[#3B82F6]/20 rounded-[20px] overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.08)] hover:border-[#3B82F6]/40 transition-all duration-300">
                        <div className="bg-[#030712] px-5 py-3 border-b border-[#3B82F6]/25 flex items-center justify-between gap-4 flex-wrap select-none">
                          {/* VS Code title dots */}
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-[#EF4444]/80" />
                            <span className="h-3 w-3 rounded-full bg-[#F59E0B]/80" />
                            <span className="h-3 w-3 rounded-full bg-[#22C55E]/80" />
                            <span className="text-[10px] text-text-muted font-mono font-bold ml-2">ArrayController.ts</span>
                          </div>

                          {/* Language Switcher Tabs */}
                          <div className="flex rounded border border-[#3B82F6]/30 overflow-hidden bg-black/30">
                            {[
                              { id: 'cpp', label: 'C++' },
                              { id: 'java', label: 'Java' },
                              { id: 'python', label: 'Python' },
                              { id: 'js', label: 'JavaScript' }
                            ].map((l) => {
                              const isActive = fundCodeLang === l.id;
                              return (
                                <button
                                  key={l.id}
                                  onClick={() => setFundCodeLang(l.id as any)}
                                  className={`px-3.5 py-1.5 text-[10px] font-mono font-bold cursor-pointer transition-all ${
                                    isActive 
                                      ? 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow font-black' 
                                      : 'text-text-muted hover:text-white hover:bg-slate-800/40'
                                  }`}
                                >
                                  {l.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <CardBody className="p-0 relative font-mono">
                          {/* Copy Button */}
                          <div className="absolute top-4 right-4 z-10 select-none">
                            <button
                              onClick={() => {
                                const codes: Record<string, string> = {
                                  cpp: `// Create an integer array of size 5\nint arr[5];\n\n// Create and initialize an array\nint arr[5] = {10, 20, 30, 40, 50};\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int arr[5] = {10, 20, 30, 40, 50};\n    cout << arr[2];\n    return 0;\n}`,
                                  java: `// Create an integer array of size 5\nint[] arr = new int[5];\n\n// Create and initialize an array\nint[] arr = {10, 20, 30, 40, 50};\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] arr = {10, 20, 30, 40, 50};\n        System.out.println(arr[2]);\n    }\n}`,
                                  python: `# Create and initialize an array-like list\narr = [10, 20, 30, 40, 50]\n\n# Access element at index 2\nprint(arr[2])`,
                                  js: `// Create and initialize an array\nlet arr = [10, 20, 30, 40, 50];\n\n// Access element at index 2\nconsole.log(arr[2]);`
                                };
                                handleCopyCode(codes[fundCodeLang]);
                              }}
                              className="p-1.5 rounded border border-[#334155] bg-[#0F172A] hover:bg-[#1E293B] text-text-muted hover:text-white transition-colors cursor-pointer"
                              title="Copy code"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <pre className="p-6 text-[11px] font-mono text-foreground/90 overflow-x-auto whitespace-pre leading-relaxed bg-transparent">
                            {fundCodeLang === 'cpp' && (
                              <span className="block text-slate-400">
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Declaration</span>
                                <span className="text-emerald-500">// Create an integer array of size 5</span>{"\n"}
                                <span className="text-blue-400">int</span> arr[<span className="text-amber-500">5</span>];{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Initialization</span>
                                <span className="text-emerald-500">// Create and initialize an array</span>{"\n"}
                                <span className="text-blue-400">int</span> arr[<span className="text-amber-500">5</span>] = &#123;<span className="text-amber-500">10, 20, 30, 40, 50</span>&#125;;{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Accessing an Element</span>
                                <span className="text-purple-400">#include</span> <span className="text-orange-400">&lt;iostream&gt;</span>{"\n"}
                                <span className="text-purple-400">using namespace</span> std;{"\n\n"}
                                <span className="text-blue-400">int</span> <span className="text-yellow-400">main</span>() &#123;{"\n"}
                                <span className="text-emerald-500">    // Array initialization</span>{"\n"}
                                {"    "}<span className="text-blue-400">int</span> arr[<span className="text-amber-500">5</span>] = &#123;<span className="text-amber-500">10, 20, 30, 40, 50</span>&#125;;{"\n\n"}
                                <span className="text-emerald-500">    // Access element at index 2</span>{"\n"}
                                {"    "}cout &lt;&lt; arr[<span className="text-amber-500">2</span>];{"\n"}
                                {"    "}<span className="text-purple-400">return</span> <span className="text-amber-500">0</span>;{"\n"}
                                &#125;{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Output</span>
                                <span className="text-white font-black bg-slate-900 border border-border-color px-2.5 py-0.5 rounded select-none inline-block">30</span>
                              </span>
                            )}
                            {fundCodeLang === 'java' && (
                              <span className="block text-slate-400">
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Declaration</span>
                                <span className="text-emerald-500">// Create an integer array of size 5</span>{"\n"}
                                <span className="text-blue-400">int</span>[] arr = <span className="text-purple-400">new int</span>[<span className="text-amber-500">5</span>];{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Initialization</span>
                                <span className="text-emerald-500">// Create and initialize an array</span>{"\n"}
                                <span className="text-blue-400">int</span>[] arr = &#123;<span className="text-amber-500">10, 20, 30, 40, 50</span>&#125;;{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Accessing an Element</span>
                                <span className="text-purple-400">public class</span> <span className="text-yellow-400">Main</span> &#123;{"\n"}
                                {"    "}<span className="text-purple-400">public static void</span> <span className="text-yellow-400">main</span>(String[] args) &#123;{"\n"}
                                <span className="text-emerald-500">        // Array initialization</span>{"\n"}
                                {"        "}<span className="text-blue-400">int</span>[] arr = &#123;<span className="text-amber-500">10, 20, 30, 40, 50</span>&#125;;{"\n\n"}
                                <span className="text-emerald-500">        // Access element at index 2</span>{"\n"}
                                {"        "}System.out.println(arr[<span className="text-amber-500">2</span>]);{"\n"}
                                {"    "}&#125;{"\n"}
                                &#125;{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Output</span>
                                <span className="text-white font-black bg-slate-900 border border-border-color px-2.5 py-0.5 rounded select-none inline-block">30</span>
                              </span>
                            )}
                            {fundCodeLang === 'python' && (
                              <span className="block text-slate-400">
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Initialization</span>
                                <span className="text-emerald-500"># Create and initialize an array-like list</span>{"\n"}
                                arr = [<span className="text-amber-500">10, 20, 30, 40, 50</span>]{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Accessing an Element</span>
                                <span className="text-emerald-500"># Array initialization</span>{"\n"}
                                arr = [<span className="text-amber-500">10, 20, 30, 40, 50</span>]{"\n\n"}
                                <span className="text-emerald-500"># Access element at index 2</span>{"\n"}
                                <span className="text-blue-400">print</span>(arr[<span className="text-amber-500">2</span>]){"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Output</span>
                                <span className="text-white font-black bg-slate-900 border border-border-color px-2.5 py-0.5 rounded select-none inline-block">30</span>
                              </span>
                            )}
                            {fundCodeLang === 'js' && (
                              <span className="block text-slate-400">
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Initialization</span>
                                <span className="text-emerald-500">// Create and initialize an array</span>{"\n"}
                                <span className="text-blue-400">let</span> arr = [<span className="text-amber-500">10, 20, 30, 40, 50</span>];{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Accessing an Element</span>
                                <span className="text-emerald-500">// Array initialization</span>{"\n"}
                                <span className="text-blue-400">let</span> arr = [<span className="text-amber-500">10, 20, 30, 40, 50</span>];{"\n\n"}
                                <span className="text-emerald-500">// Access element at index 2</span>{"\n"}
                                console.log(arr[<span className="text-amber-500">2</span>]);{"\n\n"}
                                <span className="text-white font-bold block mb-1 text-xs select-none">### Output</span>
                                <span className="text-white font-black bg-slate-900 border border-border-color px-2.5 py-0.5 rounded select-none inline-block">30</span>
                              </span>
                            )}
                          </pre>
                        </CardBody>
                      </Card>
                    </div>

                    {/* SECTION 5: KEY CHARACTERISTICS */}
                    <div id="key-characteristics" className="space-y-8">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-primary uppercase font-mono tracking-wider">Key Characteristics</h4>
                        <p className="text-xs text-text-muted font-normal">Fundamental behaviors and physical constraints that define array data structures.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                          { title: 'Fast Access', desc: 'Accessing any element via index is O(1). Simple memory offset arithmetic provides immediate access, bypassing loops.', icon: <Zap className="h-4.5 w-4.5" /> },
                          { title: 'Indexed Structure', desc: 'Offsets map directly to elements. Position references are unique integer keys (0 to n-1) pointing to stored data.', icon: <Target className="h-4.5 w-4.5" /> },
                          { title: 'Contiguous Memory', desc: 'Elements sit directly adjacent in physical RAM (|10|20|30|40|50|). Maximizes CPU cache performance.', icon: <Layers className="h-4.5 w-4.5" /> },
                          { title: 'Easy Traversal', desc: 'Iterating through elements sequentially is natural. Easily loops from start index 0 to end index n-1 in O(n) runtime.', icon: <Compass className="h-4.5 w-4.5" /> }
                        ].map((item, idx) => (
                          <motion.div
                            key={idx}
                            className="p-6 rounded-[20px] border border-[#3B82F6]/20 bg-gradient-to-br from-[#0F172A] to-[#090D16] flex flex-col gap-3 hover:border-[#3B82F6]/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] hover:scale-[1.01] transition-all duration-300"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                {item.icon}
                              </div>
                              <span className="text-sm font-black text-white">{item.title}</span>
                            </div>
                            <p className="text-xs text-text-muted leading-relaxed font-normal">{item.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* SECTION 6: WHEN SHOULD WE USE ARRAYS? */}
                    <div id="when-to-use" className="space-y-8">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-success uppercase font-mono tracking-wider">When Should We Use Arrays?</h4>
                        <p className="text-xs text-text-muted font-normal">Standard software development scenarios suited for array sequential groups.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                          { title: 'Student Marks', desc: 'Aggregating classroom scores sequentially.', icon: <Award className="h-4 w-4" /> },
                          { title: 'Product Prices', desc: 'Listing item prices in checkout catalogs.', icon: <Coins className="h-4 w-4" /> },
                          { title: 'Monthly Sales', desc: 'Tracking monthly revenue metrics.', icon: <TrendingUp className="h-4 w-4" /> },
                          { title: 'Game Scores', desc: 'Recording top player levels.', icon: <Zap className="h-4 w-4" /> }
                        ].map((item, idx) => (
                          <motion.div
                            key={idx}
                            className="p-5 rounded-[20px] border border-[#3B82F6]/20 bg-gradient-to-br from-[#0F172A] to-[#090D16] flex flex-col gap-2.5 hover:-translate-y-1.5 hover:border-[#3B82F6]/40 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5),0_0_25px_rgba(59,130,246,0.1)] transition-all duration-300"
                          >
                            <div className="h-8 w-8 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E]">
                              {item.icon}
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs font-black text-white block">{item.title}</span>
                              <p className="text-[10px] text-text-muted leading-relaxed font-normal">{item.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation control */}
                    <div className="flex justify-end max-w-full pt-4 select-none">
                      <Button
                        variant="primary"
                        size="sm"
                        className="cursor-pointer text-[10px] font-bold bg-primary text-white hover:bg-primary-hover"
                        onClick={() => {
                          setActiveTab('visualize');
                        }}
                      >
                        Go to Visualizer
                      </Button>
                    </div>
                  </div>
                )}

                {/* SECTION 2: VISUALIZE */}
                {activeTab === 'visualize' && (
                  <div className="space-y-6 max-w-full py-2 animate-fadeIn border-l-4 border-l-[#8B5CF6] pl-6 font-geist">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-mono font-bold select-none uppercase tracking-wider">
                        <Play className="h-3 w-3" />
                        <span>Section 2: Interactive Sandbox</span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Interactive Playground</h3>
                      <p className="text-xs text-text-muted font-normal">Click on the array blocks to highlight indices, trace memory offsets, and inspect cell data values.</p>
                    </div>

                    {/* Array blocks representation (Rounded, Gradient, Hover effects) */}
                    <Card id="visual-sandbox" className="border border-[#8B5CF6]/30 bg-gradient-to-br from-[#1E1B4B]/20 to-[#0F172A] rounded-[20px] shadow-[0_0_30px_rgba(139,92,246,0.12)] hover:border-[#8B5CF6]/50 transition-all duration-300">
                      <CardBody className="p-6 flex flex-col items-center justify-center gap-6 select-none relative">
                        <div className="flex flex-wrap items-center justify-center gap-4 py-4">
                          {arrayElements.map((val, idx) => {
                            const isSelected = clickedIndex === idx;
                            return (
                              <motion.div 
                                key={idx} 
                                className="flex flex-col items-center gap-2 cursor-pointer"
                                onClick={() => setClickedIndex(isSelected ? null : idx)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                {/* Array block element (Gradient, Rounded) */}
                                <div 
                                  className={`h-14 w-14 rounded-2xl border flex flex-col items-center justify-center font-mono transition-all duration-300 ${
                                    isSelected 
                                      ? 'border-[#8B5CF6] bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] text-white shadow-lg shadow-[#8B5CF6]/20 font-black'
                                      : 'border-[#8B5CF6]/30 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/25 hover:border-[#8B5CF6]/50 text-[#C084FC] font-bold shadow-[0_0_15px_rgba(139,92,246,0.05)]'
                                  }`}
                                >
                                  <span className="text-[10px]">Value</span>
                                  <span className="text-sm font-black mt-0.5">{val}</span>
                                </div>
                                <span className={`text-[9px] font-mono font-black ${isSelected ? 'text-[#8B5CF6]' : 'text-text-muted'}`}>Index {idx}</span>
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Playground Selection Display Details */}
                        {clickedIndex !== null && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-md p-4 rounded-xl border border-[#8B5CF6]/35 bg-[#8B5CF6]/10 shadow-[0_0_15px_rgba(139,92,246,0.06)] flex flex-col gap-2.5 text-xs text-text-muted font-mono"
                          >
                            <div className="flex justify-between items-center pb-1 border-b border-[#8B5CF6]/10 text-white font-black">
                              <span>Block details:</span>
                              <span className="text-[#8B5CF6] uppercase text-[10px]">Active Node</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Selected Index:</span>
                              <span className="text-white font-bold">{clickedIndex}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Stored Value:</span>
                              <span className="text-[#8B5CF6] font-bold">{arrayElements[clickedIndex]}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>RAM Memory Address:</span>
                              <span className="text-white font-bold">BaseAddress + {clickedIndex} * 4 bytes</span>
                            </div>
                            <div className="text-[10px] text-text-muted leading-relaxed font-normal border-t border-[#8B5CF6]/10 pt-2 italic">
                              Notice how RAM offsets are computed instantly. Lookups are O(1) time complexity!
                            </div>
                          </motion.div>
                        )}
                      </CardBody>
                    </Card>

                    {/* Shifting Animations Sandbox console */}
                    <div id="animation-sandbox" className="space-y-4 pt-4 border-t border-border-color/30">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-black text-[#8B5CF6] uppercase tracking-wider block">Animation Sandbox</span>
                        <p className="text-[11px] text-text-muted font-normal">Play shift-animations: Insertion, Deletion, Traversal sweeps inside contiguous cells.</p>
                      </div>

                      <div className="p-4 border border-[#8B5CF6]/25 bg-black/40 rounded-[20px] text-[11px] font-mono text-text-muted text-center shadow-inner">
                        {animationText}
                      </div>

                      <div className="flex flex-wrap gap-2.5 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer text-[10px] font-bold"
                          onClick={() => playAccess(2)}
                          disabled={animatingMode !== 'none'}
                        >
                          Access Index [2]
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer text-[10px] font-bold"
                          onClick={playTraversal}
                          disabled={animatingMode !== 'none'}
                        >
                          Play Traversal
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer text-[10px] font-bold"
                          onClick={playInsertion}
                          disabled={animatingMode !== 'none'}
                        >
                          Play Insertion
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer text-[10px] font-bold"
                          onClick={playDeletion}
                          disabled={animatingMode !== 'none'}
                        >
                          Play Deletion
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer text-[10px] font-bold"
                          onClick={() => playUpdate(1, 99)}
                          disabled={animatingMode !== 'none'}
                        >
                          Update Index [1] to 99
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 3: PATTERNS */}
                {activeTab === 'patterns' && (
                  <div className="space-y-8 max-w-full py-2 animate-fadeIn border-l-4 border-l-[#F59E0B] pl-6 font-geist">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-[10px] font-mono font-bold select-none uppercase tracking-wider">
                        <Layers className="h-3 w-3" />
                        <span>Section 3: Coding Patterns</span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Array Coding Patterns</h3>
                      <p className="text-xs text-text-muted font-normal">Mastering standard arrays patterns enables you to solve unseen interview challenges instantly.</p>
                    </div>

                    {/* Pattern Selection Switcher */}
                    <div className="flex gap-1 border-b border-border/30 pb-px overflow-x-auto select-none">
                      {patternsData.map((pattern, idx) => (
                        <button
                          key={pattern.name}
                          onClick={() => {
                            setActivePatternIndex(idx);
                            setActivePatternProblemIndex(0);
                          }}
                          className={`px-3.5 py-2 text-[11px] font-mono font-bold cursor-pointer border-b-2 transition-all shrink-0 ${
                            activePatternIndex === idx 
                              ? 'border-[#F59E0B] text-[#F59E0B] font-black' 
                              : 'border-transparent text-text-muted hover:text-white'
                          }`}
                        >
                          {pattern.name}
                        </button>
                      ))}
                    </div>

                    {/* Active Pattern Details Panel */}
                    <Card className="border border-[#F59E0B]/30 bg-gradient-to-br from-[#7C2D12]/15 to-[#0F172A] rounded-[20px] shadow-[0_0_30px_rgba(245,158,11,0.12)] hover:border-[#F59E0B]/50 transition-all duration-300">
                      <CardBody className="p-6 space-y-5 text-xs font-medium">
                        <div>
                          <h4 className="text-sm font-black text-white">{patternsData[activePatternIndex].name} Pattern</h4>
                          <p className="text-xs text-text-muted leading-relaxed font-normal mt-1">
                            {patternsData[activePatternIndex].desc}
                          </p>
                        </div>
                        
                        {/* Simulations */}
                        {activePatternIndex === 0 && (
                          <div className="p-4 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-xl space-y-3">
                            <span className="text-[9px] font-bold text-[#F59E0B] uppercase font-mono block">Traversal Sweep: Find Largest Element</span>
                            <div className="flex gap-1.5 select-none py-1.5 overflow-x-auto">
                              {[12, 35, 1, 10, 34].map((val, idx) => (
                                <div 
                                  key={idx} 
                                  className="h-8 w-10 rounded-lg border border-border/50 bg-[#F59E0B]/5 text-text-muted flex items-center justify-center font-bold"
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                            <p className="text-[10px] font-mono text-text-muted italic">Click play on standard animations inside "Visualize" tab or inspect the solved problem steps below.</p>
                          </div>
                        )}

                        {activePatternIndex === 1 && (
                          <div className="p-4 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-bold text-[#F59E0B] uppercase font-mono">Two Pointer Simulation: Target sum = 5</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-[9px] font-bold border border-border"
                                onClick={playTwoPointer}
                                disabled={twoPointerPlaying}
                              >
                                {twoPointerPlaying ? 'Running...' : 'Play Animation'}
                              </Button>
                            </div>

                            <div className="flex justify-center items-center gap-3 select-none">
                              {[1, 2, 3, 4, 5].map((val, idx) => {
                                const isL = twoPointerL === idx;
                                const isR = twoPointerR === idx;
                                return (
                                  <div key={idx} className="flex flex-col items-center gap-1.5">
                                    <div className="h-4 text-[9px] font-black text-[#FBBF24] font-mono">
                                      {isL && isR ? 'L,R' : isL ? 'L' : isR ? 'R' : ''}
                                    </div>
                                    <div className={`h-8 w-10 rounded border flex items-center justify-center font-mono font-black text-xs transition-all duration-300 ${
                                      isL || isR ? 'border-[#F59E0B] bg-[#F59E0B]/20 text-[#FBBF24] shadow-[0_0_10px_rgba(245,158,11,0.2)] font-black' : 'border-border bg-[#F59E0B]/5 text-text-muted'
                                    }`}>
                                      {val}
                                    </div>
                                    <div className="text-[8px] font-mono text-text-muted">idx {idx}</div>
                                  </div>
                                );
                              })}
                            </div>
                            <p className="text-[10px] font-mono text-text-muted text-center italic">{twoPointerStatus}</p>
                          </div>
                        )}

                        {activePatternIndex === 2 && (
                          <div className="p-4 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-bold text-[#F59E0B] uppercase font-mono">Sliding Window Sum Simulator (Size K=3)</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-[9px] font-bold border border-border"
                                onClick={playSlidingWindow}
                                disabled={windowPlaying}
                              >
                                {windowPlaying ? 'Sliding...' : 'Play Animation'}
                              </Button>
                            </div>

                            <div className="flex justify-center items-center gap-3 select-none">
                              {[2, 1, 5, 1, 3, 2].map((val, idx) => {
                                const isInWindow = idx >= windowStart && idx <= windowEnd;
                                return (
                                  <div key={idx} className="flex flex-col items-center gap-1.5">
                                    <div className={`h-8 w-10 rounded border flex items-center justify-center font-mono font-black text-xs transition-all duration-300 ${
                                      isInWindow ? 'border-[#F59E0B] bg-[#F59E0B]/20 text-[#FBBF24] shadow-[0_0_10px_rgba(245,158,11,0.2)] font-black' : 'border-border bg-[#F59E0B]/5 text-text-muted'
                                    }`}>
                                      {val}
                                    </div>
                                    <div className="text-[8px] font-mono text-text-muted">idx {idx}</div>
                                  </div>
                                );
                              })}
                            </div>
                            <p className="text-[10px] font-mono text-text-muted text-center italic">{windowStatus}</p>
                          </div>
                        )}

                        {activePatternIndex === 3 && (
                          <div className="p-4 bg-[#F59E0B]/5 border border-[#F59E0B]/20 rounded-xl space-y-3">
                            <span className="text-[9px] font-bold text-[#F59E0B] uppercase font-mono block">Prefix Sum Mapping:</span>
                            <div className="flex items-center gap-3 font-mono text-[10px] py-1 select-none">
                              <div className="space-y-1">
                                <span className="text-text-muted">Array:</span>
                                <div className="flex gap-1 text-white font-bold">
                                  {[1, 2, 3, 4].map((v, idx) => (
                                    <div key={idx} className="h-6 w-8 rounded border border-border bg-card-bg flex items-center justify-center">{v}</div>
                                  ))}
                                </div>
                              </div>
                              <div className="text-[#F59E0B] font-black text-base self-center pt-3">↓</div>
                              <div className="space-y-1">
                                <span className="text-text-muted">Prefix Sum:</span>
                                <div className="flex gap-1 text-[#FBBF24] font-black">
                                  {[1, 3, 6, 10].map((v, idx) => (
                                    <div key={idx} className="h-6 w-8 rounded border border-[#F59E0B]/40 bg-[#F59E0B]/10 flex items-center justify-center">{v}</div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-[9px] text-text-muted font-medium italic">Lookup sum of Range [1..3] as: Prefix[3] - Prefix[0] = 10 - 1 = 9.</p>
                          </div>
                        )}
                      </CardBody>
                    </Card>

                    {/* Solved Problem Playground Workspace inside Patterns */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border/20 pb-2">
                        <span className="text-[10px] font-mono font-black text-[#F59E0B] uppercase tracking-wider block">Solved Problems</span>
                        
                        {/* Switcher between problem 1 and 2 */}
                        <div className="flex rounded border border-border/60 overflow-hidden bg-black/30">
                          {patternsData[activePatternIndex].problems.map((prob, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => {
                                setActivePatternProblemIndex(pIdx);
                              }}
                              className={`px-3.5 py-1.5 text-[10px] font-mono font-bold cursor-pointer transition-all ${
                                activePatternProblemIndex === pIdx 
                                  ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow font-black' 
                                  : 'text-text-muted hover:text-white hover:bg-slate-800/40'
                              }`}
                            >
                              Problem {pIdx + 1}
                            </button>
                          ))}
                        </div>
                      </div>

                      {renderProblemWorkspace(patternsData[activePatternIndex].problems[activePatternProblemIndex])}
                    </div>
                  </div>
                )}

                {/* SECTION 4: ALGORITHMS */}
                {activeTab === 'algorithms' && (
                  <div className="space-y-8 max-w-full py-2 animate-fadeIn border-l-4 border-l-[#10B981] pl-6 font-geist">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[10px] font-mono font-bold select-none uppercase tracking-wider">
                        <Compass className="h-3 w-3" />
                        <span>Section 4: Selection Algorithms</span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Array Selection Algorithms</h3>
                      <p className="text-xs text-text-muted font-normal">Mastering sorting, binary searches, and linear sweeps makes optimal coding choices intuitive.</p>
                    </div>

                    {/* Alg Selection Switcher */}
                    <div className="flex gap-1 border-b border-border/30 pb-px overflow-x-auto select-none">
                      {algsData.map((alg, idx) => (
                        <button
                          key={alg.name}
                          onClick={() => {
                            setActiveAlgIndex(idx);
                            setActiveAlgProblemIndex(0);
                          }}
                          className={`px-3 py-2 text-[10px] font-mono font-bold cursor-pointer border-b-2 transition-all shrink-0 ${
                            activeAlgIndex === idx 
                              ? 'border-[#10B981] text-[#10B981] font-black' 
                              : 'border-transparent text-text-muted hover:text-white'
                          }`}
                        >
                          {alg.name}
                        </button>
                      ))}
                    </div>

                    {/* Active Algorithm Info card */}
                    <Card className="border border-[#10B981]/30 bg-gradient-to-br from-[#064E3B]/15 to-[#0F172A] rounded-[20px] shadow-[0_0_30px_rgba(16,185,129,0.12)] hover:border-[#10B981]/50 transition-all duration-300">
                      <CardBody className="p-6 space-y-4 text-xs font-medium">
                        <div>
                          <h4 className="text-sm font-black text-white">{algsData[activeAlgIndex].name}</h4>
                          <p className="text-xs text-text-muted leading-relaxed font-normal mt-1">
                            {algsData[activeAlgIndex].desc}
                          </p>
                        </div>
                      </CardBody>
                    </Card>

                    {/* Solved Problem Playground Workspace inside Algorithms */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border/20 pb-2">
                        <span className="text-[10px] font-mono font-black text-[#10B981] uppercase tracking-wider block">Solved Problems</span>
                        
                        {/* Switcher between problem 1 and 2 */}
                        <div className="flex rounded border border-border/60 overflow-hidden bg-black/30">
                          {algsData[activeAlgIndex].problems.map((prob, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => {
                                setActiveAlgProblemIndex(pIdx);
                              }}
                              className={`px-3.5 py-1.5 text-[10px] font-mono font-bold cursor-pointer transition-all ${
                                activeAlgProblemIndex === pIdx 
                                  ? 'bg-gradient-to-r from-[#10B981] to-[#047857] text-white shadow font-black' 
                                  : 'text-text-muted hover:text-white hover:bg-slate-800/40'
                              }`}
                            >
                              Problem {pIdx + 1}
                            </button>
                          ))}
                        </div>
                      </div>

                      {renderProblemWorkspace(algsData[activeAlgIndex].problems[activeAlgProblemIndex])}
                    </div>
                  </div>
                )}

                {/* SECTION 5: INTERVIEW QUESTIONS */}
                {activeTab === 'questions' && (
                  <div className="space-y-6 max-w-full py-2 animate-fadeIn border-l-4 border-l-[#EF4444] pl-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">5. Interview Questions Workspace</h3>
                      <p className="text-xs text-text-muted font-normal">Learn logical problem breakdowns step-by-step. Select a focus question to start.</p>
                    </div>

                    {/* Questions select switcher */}
                    <div className="flex gap-1.5 border-b border-border/30 pb-px overflow-x-auto select-none">
                      {[
                        'Find Maximum',
                        'Two Sum',
                        'Max Subarray Sum',
                        'Range Sum Query',
                        'Search in Sorted'
                      ].map((name, idx) => (
                        <button
                          key={name}
                          onClick={() => setActiveQuestionIndex(idx)}
                          className={`px-3 py-2 text-[10px] font-mono font-bold transition-all shrink-0 cursor-pointer border-b-2 ${
                            activeQuestionIndex === idx 
                              ? 'border-primary text-primary font-black' 
                              : 'border-transparent text-text-muted hover:text-white'
                          }`}
                        >
                          Q{idx + 1}: {name}
                        </button>
                      ))}
                    </div>

                    {/* Rendering 6-step accordion details for active question */}
                    {(() => {
                      const questionsData = [
                        {
                          title: 'Find Maximum Element',
                          pattern: 'Traversal',
                          algorithm: 'Sequential Scan',
                          leetcode: 'https://leetcode.com/problems/find-numbers-with-even-number-of-digits/',
                          understand: 'Scan the array from index 0 to n-1, maintaining a variable for the highest value found so far.',
                          thinking: 'The interviewer wants to see how you track variables sequentially. If the array is unsorted, we must check every cell, so a single pass is the best possible runtime.',
                          brute: 'Initialize `maxVal = -Infinity`. Inspect each element. If `Array[i] > maxVal`, update `maxVal`.',
                          optimal: 'Same as brute force. An unsorted array requires checking all elements, so O(n) is optimal.',
                          cpp: `int findMax(int arr[], int n) {
    int maxVal = arr[0];
    for(int i = 1; i < n; i++) {
        if(arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}`,
                          java: `public int findMax(int[] arr) {
    int maxVal = arr[0];
    for(int i = 1; i < arr.length; i++) {
        if(arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}`,
                          python: `def find_max(arr):
    max_val = arr[0]
    for i in range(1, len(arr)):
        if arr[i] > max_val:
            max_val = arr[i]
    return max_val`,
                          complexity: 'Time Complexity: O(n) (one full traversal pass). Space Complexity: O(1) (requires only a single tracking variable).'
                        },
                        {
                          title: 'Two Sum',
                          pattern: 'Two Pointer',
                          algorithm: 'Inward Pointers',
                          leetcode: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
                          understand: 'Given a sorted array, locate two distinct values whose sum equals a target number.',
                          thinking: 'Instead of searching all pairs using nested loops O(n^2), we exploit the sorted order. Pointers L and R start at edges. Sum calculation indicates which boundary must shrink.',
                          brute: 'Check every possible pair using nested loops: `for i from 0..n` and `for j from i+1..n`. Returns when sum is matching. Complexity: O(n^2).',
                          optimal: 'Position Left=0 and Right=n-1. If sum is target, return indices. If sum is smaller, increase sum by shifting L right. Else, decrease sum by shifting R left.',
                          cpp: `vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0, right = numbers.size() - 1;
    while(left < right) {
        int sum = numbers[left] + numbers[right];
        if(sum == target) return {left + 1, right + 1};
        if(sum < target) left++;
        else right--;
    }
    return {};
}`,
                          java: `public int[] twoSum(int[] numbers, int target) {
    int left = 0, right = numbers.length - 1;
    while(left < right) {
        int sum = numbers[left] + numbers[right];
        if(sum == target) return new int[]{left + 1, right + 1};
        if(sum < target) left++;
        else right--;
    }
    return new int[]{};
}`,
                          python: `def two_sum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left + 1, right + 1]
        if current_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
                          complexity: 'Time Complexity: O(n) (pointers sweep elements once). Space Complexity: O(1) (only local pointer offsets stored).'
                        },
                        {
                          title: 'Maximum Sum Subarray',
                          pattern: 'Sliding Window / Kadane',
                          algorithm: 'Kadane\'s Algorithm',
                          leetcode: 'https://leetcode.com/problems/maximum-subarray/',
                          understand: 'Locate a contiguous subarray slice having the largest sum of values.',
                          thinking: 'Kadane algorithm accumulates totals. If the current subtotal drops below zero, we discard it and restart the window at the next index, because a negative prefix only hurts subsequent totals.',
                          brute: 'Calculate the sum of all possible subarrays: loops starting at `i` and ending at `j`, adding elements. Complexity: O(n^2).',
                          optimal: 'Accumulate prefix sum. If prefix drops below 0, reset prefix to current element. Track max prefix found so far.',
                          cpp: `int maxSubArray(vector<int>& nums) {
    int maxSoFar = nums[0], currentMax = nums[0];
    for(size_t i = 1; i < nums.size(); i++) {
        currentMax = max(nums[i], currentMax + nums[i]);
        maxSoFar = max(maxSoFar, currentMax);
    }
    return maxSoFar;
}`,
                          java: `public int maxSubArray(int[] nums) {
    int maxSoFar = nums[0], currentMax = nums[0];
    for(int i = 1; i < nums.length; i++) {
        currentMax = Math.max(nums[i], currentMax + nums[i]);
        maxSoFar = Math.max(maxSoFar, currentMax);
    }
    return maxSoFar;
}`,
                          python: `def max_sub_array(nums):
    max_so_far = current_max = nums[0]
    for i in range(1, len(nums)):
        current_max = max(nums[i], current_max + nums[i])
        max_so_far = max(max_so_far, current_max)
    return max_so_far`,
                          complexity: 'Time Complexity: O(n) (scans the array sequentially in a single pass). Space Complexity: O(1) (requires only local sum cache trackers).'
                        },
                        {
                          title: 'Range Sum Query',
                          pattern: 'Prefix Sum',
                          algorithm: 'Cumulative Array pre-lookup',
                          leetcode: 'https://leetcode.com/problems/range-sum-query-immutable/',
                          understand: 'Retrieve the sum of elements between indices L and R inclusive multiple times.',
                          thinking: 'Loops for every query yield bad complexities if query count is high. Precompute prefix running totals. Sum of index interval L to R is Prefix[R] - Prefix[L-1] instantly.',
                          brute: 'Loop from index L to R for every query: `for i from L..R` adding elements. Complexity: O(n) per query.',
                          optimal: 'Calculate a prefix sum array in O(n) setup time. Retrieve range sums dynamically as: `Prefix[R] - Prefix[L-1]` in O(1) time.',
                          cpp: `class NumArray {
    vector<int> prefix;
public:
    NumArray(vector<int>& nums) {
        int sum = 0;
        for(int num : nums) {
            sum += num;
            prefix.push_back(sum);
        }
    }
    int sumRange(int left, int right) {
        if(left == 0) return prefix[right];
        return prefix[right] - prefix[left - 1];
    }
};`,
                          java: `class NumArray {
    private int[] prefix;
    public NumArray(int[] nums) {
        prefix = new int[nums.length];
        int sum = 0;
        for(int i = 0; i < nums.length; i++) {
            sum += nums[i];
            prefix[i] = sum;
        }
    }
    public int sumRange(int left, int right) {
        if(left == 0) return prefix[right];
        return prefix[right] - prefix[left - 1];
    }
}`,
                          python: `class NumArray:
    def __init__(self, nums: List[int]):
        self.prefix = []
        running_sum = 0
        for num in nums:
            running_sum += num
            self.prefix.append(running_sum)

    def sum_range(self, left: int, right: int) -> int:
        if left == 0:
            return self.prefix[right]
        return self.prefix[right] - self.prefix[left - 1]`,
                          complexity: 'Setup Complexity: O(n) time and space. Query Complexity: O(1) runtime (subtraction lookup).'
                        },
                        {
                          title: 'Search in Sorted Array',
                          pattern: 'Binary Search',
                          algorithm: 'Interval Halving',
                          leetcode: 'https://leetcode.com/problems/binary-search/',
                          understand: 'Determine if target element exists in a sorted array and return its index.',
                          thinking: 'The interviewer is testing if you recognize sorting as a hint to halve boundaries, cutting search spaces in half each iteration.',
                          brute: 'Perform linear search scan from beginning to end. Complexity: O(n).',
                          optimal: 'Initialize `low = 0` and `high = n-1`. Loop while `low <= high`. Find `mid = low + (high-low)/2`. If value is mid, return mid. If smaller, high = mid-1. Else, low = mid+1.',
                          cpp: `int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while(low <= high) {
        int mid = low + (high - low) / 2;
        if(nums[mid] == target) return mid;
        if(nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
                          java: `public int search(int[] nums, int target) {
    int low = 0, high = nums.length - 1;
    while(low <= high) {
        int mid = low + (high - low) / 2;
        if(nums[mid] == target) return mid;
        if(nums[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
                          python: `def search(nums, target):
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
                          complexity: 'Time Complexity: O(log n) (halves index range at every step). Space Complexity: O(1) (requires only local limits).'
                        }
                      ];


                      const currentQ = questionsData[activeQuestionIndex];
                      return renderProblemWorkspace(mapQuestionToProblem(currentQ));
                    })()}
                  </div>
                )}

                {/* SECTION 7: QUICK REVISION */}
                {activeTab === 'revision' && (
                  <div className="space-y-6 max-w-full py-2 animate-fadeIn select-none border-l-4 border-l-[#06B6D4] pl-6 font-geist">
                    <div className="flex items-center gap-3 p-4 bg-cyan-950/40 border border-cyan-800/40 rounded-2xl select-none">
                      <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Sparkles className="h-5 w-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">Arrays Module Complete!</h4>
                        <p className="text-[11px] text-cyan-200/70 font-medium">You have unlocked the premium revision sheet below. Practice and keep it handy for interviews.</p>
                      </div>
                    </div>

                    {/* Print CSS Injection */}
                    <style dangerouslySetInnerHTML={{__html: `
                      @media print {
                        body * {
                          visibility: hidden;
                        }
                        #a1-printable-worksheet, #a1-printable-worksheet * {
                          visibility: visible;
                        }
                        #a1-printable-worksheet {
                          position: absolute;
                          left: 0;
                          top: 0;
                          width: 100%;
                          color: #000 !important;
                          background: #fff !important;
                          padding: 40px !important;
                          box-shadow: none !important;
                          border: none !important;
                        }
                        #a1-printable-worksheet * {
                          color: #000 !important;
                          border-color: #ddd !important;
                          background: transparent !important;
                          box-shadow: none !important;
                          text-shadow: none !important;
                        }
                        #a1-printable-worksheet .no-print {
                          display: none !important;
                        }
                      }
                    `}} />

                    {/* Revision sheet layout */}
                    <div id="a1-printable-worksheet" className="rounded-[20px] bg-gradient-to-br from-[#0891B2] to-[#2563EB] p-6 text-white shadow-[0_20px_50px_rgba(8,145,178,0.3)] border border-[#06B6D4]/30 relative overflow-hidden flex flex-col gap-6">
                      {/* Blur effects for premium screen visual depth */}
                      <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl -mr-12 -mt-12 no-print pointer-events-none" />
                      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl no-print pointer-events-none" />

                      {/* Title Header with download button */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-white/20">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-black text-cyan-200 uppercase tracking-widest">Revision Sheet</span>
                          <h2 className="text-xl font-black tracking-tight">ARRAYS QUICK REVISION</h2>
                        </div>
                        <button
                          onClick={() => window.print()}
                          className="bg-white hover:bg-cyan-50 text-[#0891B2] font-black text-xs px-5 py-2.5 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer no-print self-start sm:self-center font-sans active:scale-95"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download Notes</span>
                        </button>
                      </div>

                      {/* Section 1: Definition */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-black uppercase font-mono tracking-wider text-cyan-100">I. Definition</h3>
                        <p className="text-sm font-medium leading-relaxed text-white/90">
                          An <strong className="text-white underline decoration-cyan-200 decoration-2">Array</strong> is a linear data structure that stores a collection of homogeneous elements sequentially in contiguous memory locations. It allows direct, random access in <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs">O(1)</code> time using index-based address arithmetic.
                        </p>
                      </div>

                      {/* Grid of properties & complexities */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Properties */}
                        <div id="key-properties" className="space-y-3">
                          <h3 className="text-xs font-black uppercase font-mono tracking-wider text-cyan-100">II. Key Properties</h3>
                          <div className="grid grid-cols-1 gap-2.5">
                            {[
                              { name: "Contiguous Layout", desc: "Elements are placed side-by-side in RAM." },
                              { name: "Homogeneous Types", desc: "All elements occupy identical byte sizing." },
                              { name: "Constant Access", desc: "Address = BaseAddress + index * ElementWidth." },
                              { name: "Static Capacity", desc: "Fixed size allocation at compilation time." }
                            ].map((prop, idx) => (
                              <div key={idx} className="flex gap-2.5 items-start bg-white/10 border border-white/20 shadow-md backdrop-blur-sm rounded-xl p-3 hover:bg-white/15 hover:border-white/35 hover:scale-[1.01] transition-all duration-300">
                                <span className="h-5 w-5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black font-mono flex items-center justify-center shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <div>
                                  <span className="text-xs font-bold block">{prop.name}</span>
                                  <span className="text-[11px] text-white/70 font-normal leading-relaxed">{prop.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Complexities Table */}
                        <div id="complexity-table" className="space-y-3">
                          <h3 className="text-xs font-black uppercase font-mono tracking-wider text-cyan-100">III. Time & Space Complexities</h3>
                          <div className="bg-white/10 border border-white/25 shadow-md backdrop-blur-sm rounded-[20px] p-4 space-y-3 font-mono text-xs hover:border-white/40 transition-all duration-300">
                            <div className="flex justify-between pb-2 border-b border-white/10">
                              <span className="font-bold">Operation</span>
                              <span className="font-bold text-cyan-200">Time Complexity</span>
                            </div>
                            <div className="flex justify-between text-white/90">
                              <span>Access / Update</span>
                              <span className="font-bold text-green-300">O(1)</span>
                            </div>
                            <div className="flex justify-between text-white/90">
                              <span>Search (Linear)</span>
                              <span>O(n)</span>
                            </div>
                            <div className="flex justify-between text-white/90">
                              <span>Insertion</span>
                              <span>O(n)</span>
                            </div>
                            <div className="flex justify-between text-white/90">
                              <span>Deletion</span>
                              <span>O(n)</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-white/10 text-cyan-100 font-bold">
                              <span>Space Complexity</span>
                              <span className="text-cyan-200">O(n)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Visual Example */}
                      <div className="space-y-3 pt-2">
                        <h3 className="text-xs font-black uppercase font-mono tracking-wider text-cyan-100">IV. Continuous Memory Representation</h3>
                        <div className="bg-black/35 border border-white/15 shadow-inner rounded-[20px] p-6 flex flex-col items-center justify-center gap-3 hover:border-white/25 transition-all duration-300">
                          <div className="flex items-center gap-2 select-none flex-wrap justify-center">
                            {[10, 20, 30, 40].map((val, idx) => (
                              <div key={idx} className="flex flex-col items-center gap-1.5">
                                <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-mono font-black text-sm text-white">
                                  {val}
                                </div>
                                <div className="text-[9px] font-mono text-cyan-200/90 font-black">idx {idx}</div>
                                <div className="text-[8px] font-mono text-white/50">{`0x${(2000 + idx * 4).toString(16).toUpperCase()}`}</div>
                              </div>
                            ))}
                          </div>
                          <div className="text-[10px] font-mono text-white/70 italic text-center">
                            Formula: Address of Index 2 = 0x7D0 (Base) + 2 * 4 bytes = 0x7D8. Instant lookups!
                          </div>
                        </div>
                      </div>

                      {/* Interview Tip Banner */}
                      <div className="p-4 bg-white/10 border border-white/20 shadow-md backdrop-blur-sm rounded-xl space-y-1.5 hover:bg-white/15 transition-all duration-300">
                        <span className="text-[9px] font-black text-cyan-200 uppercase font-mono tracking-wider block">Pro Interview Tip</span>
                        <p className="text-xs text-white/90 leading-relaxed font-normal italic">
                          If an arrays question specifies that inputs are sorted, always consider using <strong className="text-white">Two Pointers</strong> (sweeping inwards) or <strong className="text-white">Binary Search</strong> (reducing search space by half) to meet the optimal time complexity target.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* SECTION 1: UNDERSTAND */}
                {activeTab === 'understand' && (
                  <div className="space-y-6 max-w-full py-2">
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Simple Explanation</h3>
                      <p className="text-xs leading-relaxed text-text-muted font-normal">
                        {simplerExplanation || topic.understand.explanation}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-card-bg/30 space-y-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Compass className="h-4.5 w-4.5 text-secondary" />
                        <span>Real-World Analogy</span>
                      </h3>
                      <p className="text-xs leading-relaxed text-text-muted font-normal italic">
                        {customAnalogy || topic.understand.analogy}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Visual Example</h3>
                      <div className="p-4 rounded-lg border border-border/40 bg-black/35 flex items-center justify-center font-mono text-xs text-primary font-bold">
                        {topic.understand.visualExample}
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 2: VISUALIZE */}
                {activeTab === 'visualize' && (
                  <div className="space-y-6 max-w-full py-2">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Interactive Visual Sandbox</h3>
                      <p className="text-xs text-text-muted">Trace algorithm mechanics visually. Click an operation to start element-shifting animations.</p>
                    </div>

                    {/* Render Visual Array Cells */}
                    <div className="p-6 rounded-xl border border-border bg-black/30 flex flex-col items-center justify-center gap-6 min-h-[140px] select-none">
                      <div className="flex items-center gap-3">
                        {arrayElements.map((val, idx) => {
                          const isPointerActive = activePointer === idx;
                          const isHighlighted = highlightedIndices.includes(idx);
                          return (
                            <div key={idx} className="flex flex-col items-center gap-2">
                              {/* Array Cell */}
                              <div 
                                className={`h-12 w-12 rounded-lg border flex items-center justify-center font-mono text-xs font-black transition-all duration-300 ${
                                  isPointerActive 
                                    ? 'border-primary bg-primary/20 text-white scale-110 shadow-lg shadow-primary/20'
                                    : isHighlighted
                                      ? 'border-secondary bg-secondary/15 text-white scale-105'
                                      : 'border-border bg-card-bg/40 text-text-muted'
                                }`}
                              >
                                {val}
                              </div>
                              
                              {/* Index and Pointer indicator */}
                              <div className="text-[10px] font-bold font-mono text-text-muted">
                                idx {idx}
                              </div>
                              {isPointerActive && (
                                <div className="text-primary font-black animate-bounce">
                                  ^
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Animation status box */}
                    <div className="p-3.5 border border-border/40 bg-card-bg/20 rounded-lg text-xs font-mono text-text-muted text-center leading-relaxed">
                      {animationText}
                    </div>

                    {/* Interactive Trigger Buttons */}
                    <div className="flex gap-3 justify-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="cursor-pointer text-[10px] font-bold"
                        onClick={playTraversal}
                        disabled={animatingMode !== 'none'}
                      >
                        Play Traversal
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="cursor-pointer text-[10px] font-bold"
                        onClick={playInsertion}
                        disabled={animatingMode !== 'none'}
                      >
                        Play Insertion
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="cursor-pointer text-[10px] font-bold"
                        onClick={playDeletion}
                        disabled={animatingMode !== 'none'}
                      >
                        Play Deletion
                      </Button>
                    </div>
                  </div>
                )}

                {/* SECTION 3: PATTERNS & ALGORITHMS */}
                {activeTab === 'patterns' && (
                  <div className="space-y-8 max-w-full py-2">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Recognizable Coding Patterns</h3>
                        <p className="text-xs text-text-muted">Mastering patterns prepares you to instantly solve dynamic problems under unseen constraints.</p>
                      </div>

                      <div className="space-y-4">
                        {topic.patterns.map((pat, idx) => (
                          <Card key={idx} className="border border-primary/20 bg-gradient-to-br from-[#1E293B]/25 to-[#0F172A] rounded-[20px] shadow-[0_0_20px_rgba(59,130,246,0.06)] hover:border-primary/45 hover:scale-[1.01] transition-all duration-300">
                            <CardHeader className="py-3">
                              <CardTitle className="text-sm font-black text-white">{pat.name} Pattern</CardTitle>
                            </CardHeader>
                            <CardBody className="p-4 pt-0 space-y-4 text-xs font-medium">
                              
                              {/* Recognition Block */}
                              <div className="p-3 bg-secondary/5 border border-secondary/15 rounded-lg space-y-1">
                                <span className="text-[9px] font-black text-secondary uppercase tracking-wider font-mono">How do I identify this pattern?</span>
                                <p className="text-xs text-text-muted font-normal leading-relaxed">{pat.recognition}</p>
                              </div>

                              <div className="flex flex-wrap gap-1.5 items-center">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono mr-1.5">Keywords:</span>
                                {pat.keywords.map(kw => (
                                  <span key={kw} className="px-2 py-0.5 rounded bg-card-bg border border-border text-[9px] font-bold text-foreground font-mono">
                                    {kw}
                                  </span>
                                ))}
                              </div>

                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold text-text-muted uppercase font-mono block">Standard Practice Problems:</span>
                                <div className="flex flex-col gap-1">
                                  {pat.questions.map(q => (
                                    <a 
                                      key={q.name}
                                      href={q.leetcode}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary hover:underline font-bold inline-flex items-center gap-1"
                                    >
                                      <span>• {q.name}</span>
                                    </a>
                                  ))}
                                </div>
                              </div>

                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 border-t border-border/40 pt-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Selection Guideline</h3>
                        <p className="text-xs text-text-muted">Compare algorithms to understand when each model is optimal.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {topic.algorithms.map((alg, idx) => (
                          <Card key={idx} className="border border-primary/20 bg-gradient-to-br from-[#1E293B]/25 to-[#0F172A] rounded-[20px] shadow-[0_0_20px_rgba(59,130,246,0.06)] hover:border-primary/45 hover:scale-[1.01] transition-all duration-300">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-xs font-extrabold text-white">{alg.name}</CardTitle>
                            </CardHeader>
                            <CardBody className="p-4 pt-0 space-y-3 text-xs font-medium">
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-black text-primary uppercase font-mono">Use When</span>
                                <p className="text-xs text-text-muted font-normal leading-relaxed">{alg.useWhen}</p>
                              </div>
                              <div className="pt-2 border-t border-border/20 text-[9px] font-bold font-mono text-text-muted uppercase flex justify-between">
                                <span>Complexity</span>
                                <span className="text-primary">{alg.complexity}</span>
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 4: QUESTIONS */}
                {activeTab === 'questions' && (
                  <div className="space-y-6 max-w-full py-2">
                    <div className="space-y-2 select-none">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Focus Problems Workspace</h3>
                      <p className="text-xs text-text-muted">Mastering these handpicked questions maps out 90% of interview challenges.</p>
                    </div>

                    {topic.questions && topic.questions.length > 0 && (
                      <>
                        {/* Questions select switcher */}
                        <div className="flex gap-1.5 border-b border-border/30 pb-px overflow-x-auto select-none mb-6">
                          {topic.questions.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveQuestionIndex(idx)}
                              className={`px-3 py-2 text-[10px] font-mono font-bold transition-all shrink-0 cursor-pointer border-b-2 ${
                                activeQuestionIndex === idx 
                                  ? 'border-primary text-primary font-black' 
                                  : 'border-transparent text-text-muted hover:text-white'
                              }`}
                            >
                              Q{idx + 1}: {q.name}
                            </button>
                          ))}
                        </div>

                        {topic.questions[activeQuestionIndex] && renderProblemWorkspace(mapFallbackQuestionToProblem(topic.questions[activeQuestionIndex]))}
                      </>
                    )}
                  </div>
                )}

                {/* SECTION 5: REVISE */}
                {activeTab === 'revise' && (
                  <div className="space-y-6 max-w-full py-2">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">30-Second Quick Cheat Sheet</h3>
                      <p className="text-xs text-text-muted">A quick high-density scan before entering an interview.</p>
                    </div>

                    <Card className="border border-secondary/30 bg-gradient-to-br from-secondary/10 to-[#0B1220] rounded-[20px] shadow-[0_0_30px_rgba(139,92,246,0.1)] hover:border-secondary/50 transition-all duration-300">
                      <CardBody className="p-6">
                        <div className="space-y-4">
                          {topic.revise.points.map((point, idx) => (
                            <div key={idx} className="flex gap-3 text-xs font-semibold text-text-muted">
                              <span className="h-5 w-5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black font-mono flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <p className="leading-relaxed pt-0.5">{point}</p>
                            </div>
                          ))}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </>
            )
          )}

          </div>

        </div>

      </div>
    </div>
  );
}
