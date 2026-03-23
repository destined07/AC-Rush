import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';
import { pathToFileURL } from 'url';

dotenv.config();

export const sampleProblems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers and a target, find two numbers that add up to the target and print their 0-based indices.\n\nInput format:\n- First line: space-separated integers (the array)\n- Second line: an integer (the target)\n\nOutput format:\n- Two space-separated indices',
    difficulty: 'Easy',
    category: 'Arrays',
    tags: ['Array', 'Hash Table'],
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\nExactly one valid answer exists.',
    examples: [
      { input: '2 7 11 15\n9', output: '0 1', isExample: true },
      { input: '3 2 4\n6', output: '1 2', isExample: true }
    ],
    hiddenTestCases: [
      { input: '3 3\n6', output: '0 1', isExample: false },
      { input: '1 5 3 7\n8', output: '1 2', isExample: false },
      { input: '4 2 9 1\n3', output: '1 3', isExample: false }
    ],
    starterCode: {
      python: 'nums = list(map(int, input().split()))\ntarget = int(input())\n\nfor i in range(len(nums)):\n    for j in range(i + 1, len(nums)):\n        if nums[i] + nums[j] == target:\n            print(i, j)\n            break\n',
      cpp: '#include <iostream>\n#include <vector>\n#include <sstream>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n    istringstream iss(line);\n    vector<int> nums;\n    int x;\n    while (iss >> x) nums.push_back(x);\n    int target;\n    cin >> target;\n    for (int i = 0; i < nums.size(); i++)\n        for (int j = i + 1; j < nums.size(); j++)\n            if (nums[i] + nums[j] == target) {\n                cout << i << " " << j << endl;\n                return 0;\n            }\n    return 0;\n}\n',
      java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] parts = sc.nextLine().split(" ");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        int target = Integer.parseInt(sc.nextLine().trim());\n        for (int i = 0; i < nums.length; i++)\n            for (int j = i + 1; j < nums.length; j++)\n                if (nums[i] + nums[j] == target) {\n                    System.out.println(i + " " + j);\n                    return;\n                }\n    }\n}\n'
    }
  },
  {
    title: 'Reverse String',
    description: 'Read a string from stdin and print it reversed.\n\nInput format:\n- A single line containing a string\n\nOutput format:\n- The reversed string',
    difficulty: 'Easy',
    category: 'Strings',
    tags: ['String', 'Two Pointers'],
    constraints: '1 <= s.length <= 10^5\ns contains printable ASCII characters.',
    examples: [
      { input: 'hello', output: 'olleh', isExample: true },
      { input: 'Hannah', output: 'hannaH', isExample: true }
    ],
    hiddenTestCases: [
      { input: 'a', output: 'a', isExample: false },
      { input: 'abcdef', output: 'fedcba', isExample: false },
      { input: 'racecar', output: 'racecar', isExample: false }
    ],
    starterCode: {
      python: 's = input()\nprint(s[::-1])\n',
      cpp: '#include <iostream>\n#include <algorithm>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    reverse(s.begin(), s.end());\n    cout << s << endl;\n    return 0;\n}\n',
      java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        System.out.println(new StringBuilder(s).reverse().toString());\n    }\n}\n'
    }
  },
  {
    title: 'Climbing Stairs',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?\n\nInput format:\n- A single integer n\n\nOutput format:\n- A single integer (number of distinct ways)',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    tags: ['Dynamic Programming', 'Math'],
    constraints: '1 <= n <= 45',
    examples: [
      { input: '2', output: '2', isExample: true },
      { input: '3', output: '3', isExample: true }
    ],
    hiddenTestCases: [
      { input: '1', output: '1', isExample: false },
      { input: '5', output: '8', isExample: false },
      { input: '10', output: '89', isExample: false }
    ],
    starterCode: {
      python: 'n = int(input())\na, b = 1, 1\nfor _ in range(n - 1):\n    a, b = b, a + b\nprint(b)\n',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    int a = 1, b = 1;\n    for (int i = 1; i < n; i++) {\n        int t = b;\n        b = a + b;\n        a = t;\n    }\n    cout << b << endl;\n    return 0;\n}\n',
      java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int a = 1, b = 1;\n        for (int i = 1; i < n; i++) {\n            int t = b;\n            b = a + b;\n            a = t;\n        }\n        System.out.println(b);\n    }\n}\n'
    }
  },
  {
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.\n\nA string is valid if:\n1. Open brackets are closed by the same type.\n2. Open brackets are closed in the correct order.\n\nInput format:\n- A single string\n\nOutput format:\n- "true" or "false"',
    difficulty: 'Easy',
    category: 'Strings',
    tags: ['String', 'Stack'],
    constraints: '1 <= s.length <= 10^4',
    examples: [
      { input: '()', output: 'true', isExample: true },
      { input: '()[]{}', output: 'true', isExample: true },
      { input: '(]', output: 'false', isExample: true }
    ],
    hiddenTestCases: [
      { input: '{[]}', output: 'true', isExample: false },
      { input: '([)]', output: 'false', isExample: false },
      { input: '((()))', output: 'true', isExample: false }
    ],
    starterCode: {
      python: 's = input().strip()\nstack = []\nmapping = {")": "(", "}": "{", "]": "["}\nfor ch in s:\n    if ch in mapping:\n        if not stack or stack[-1] != mapping[ch]:\n            print("false")\n            exit()\n        stack.pop()\n    elif ch in "({[":\n        stack.append(ch)\nprint("true" if not stack else "false")\n',
      cpp: '#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    stack<char> st;\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') {\n            st.push(c);\n        } else if (c == \')\' || c == \'}\' || c == \']\') {\n            if (st.empty()) { cout << "false" << endl; return 0; }\n            char top = st.top(); st.pop();\n            if ((c == \')\' && top != \'(\') || (c == \'}\' && top != \'{\') || (c == \']\' && top != \'[\')) {\n                cout << "false" << endl; return 0;\n            }\n        }\n    }\n    cout << (st.empty() ? "true" : "false") << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.hasNextLine() ? sc.nextLine().trim() : "";\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == \'(\' || c == \'{\' || c == \'[\') {\n                stack.push(c);\n            } else if (c == \')\' || c == \'}\' || c == \']\') {\n                if (stack.isEmpty()) { System.out.println("false"); return; }\n                char top = stack.pop();\n                if ((c == \')\' && top != \'(\') || (c == \'}\' && top != \'{\') || (c == \']\' && top != \'[\')) {\n                    System.out.println("false"); return;\n                }\n            }\n        }\n        System.out.println(stack.isEmpty() ? "true" : "false");\n    }\n}\n'
    }
  },
  {
    title: 'Fibonacci Number',
    description: 'Given n, calculate the nth Fibonacci number.\n\nF(0) = 0, F(1) = 1\nF(n) = F(n-1) + F(n-2) for n > 1\n\nInput format:\n- A single integer n\n\nOutput format:\n- A single integer F(n)',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    tags: ['Dynamic Programming', 'Math', 'Recursion'],
    constraints: '0 <= n <= 30',
    examples: [
      { input: '2', output: '1', isExample: true },
      { input: '4', output: '3', isExample: true }
    ],
    hiddenTestCases: [
      { input: '0', output: '0', isExample: false },
      { input: '1', output: '1', isExample: false },
      { input: '10', output: '55', isExample: false },
      { input: '20', output: '6765', isExample: false }
    ],
    starterCode: {
      python: 'n = int(input())\nif n <= 1:\n    print(n)\nelse:\n    a, b = 0, 1\n    for _ in range(n - 1):\n        a, b = b, a + b\n    print(b)\n',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    if (n <= 1) { cout << n << endl; return 0; }\n    int a = 0, b = 1;\n    for (int i = 1; i < n; i++) {\n        int t = b;\n        b = a + b;\n        a = t;\n    }\n    cout << b << endl;\n    return 0;\n}\n',
      java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        if (n <= 1) { System.out.println(n); return; }\n        int a = 0, b = 1;\n        for (int i = 1; i < n; i++) {\n            int t = b;\n            b = a + b;\n            a = t;\n        }\n        System.out.println(b);\n    }\n}\n'
    }
  },
  {
    title: 'Maximum Subarray',
    description: 'Given an integer array, find the subarray with the largest sum and return its sum.\n\nInput format:\n- A single line of space-separated integers\n\nOutput format:\n- A single integer (the maximum subarray sum)',
    difficulty: 'Medium',
    category: 'Arrays',
    tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
    examples: [
      { input: '-2 1 -3 4 -1 2 1 -5 4', output: '6', isExample: true },
      { input: '1', output: '1', isExample: true }
    ],
    hiddenTestCases: [
      { input: '5 4 -1 7 8', output: '23', isExample: false },
      { input: '-1', output: '-1', isExample: false },
      { input: '-2 -1', output: '-1', isExample: false },
      { input: '1 2 3 4 5', output: '15', isExample: false }
    ],
    starterCode: {
      python: 'nums = list(map(int, input().split()))\nmax_sum = cur = nums[0]\nfor x in nums[1:]:\n    cur = max(x, cur + x)\n    max_sum = max(max_sum, cur)\nprint(max_sum)\n',
      cpp: '#include <iostream>\n#include <sstream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n    istringstream iss(line);\n    vector<int> nums;\n    int x;\n    while (iss >> x) nums.push_back(x);\n    int maxSum = nums[0], cur = nums[0];\n    for (int i = 1; i < nums.size(); i++) {\n        cur = max(nums[i], cur + nums[i]);\n        maxSum = max(maxSum, cur);\n    }\n    cout << maxSum << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] parts = sc.nextLine().trim().split("\\\\s+");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        int maxSum = nums[0], cur = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            cur = Math.max(nums[i], cur + nums[i]);\n            maxSum = Math.max(maxSum, cur);\n        }\n        System.out.println(maxSum);\n    }\n}\n'
    }
  },
  {
    title: 'Palindrome Check',
    description: 'Given a string, determine if it is a palindrome (reads the same forwards and backwards). Consider only alphanumeric characters and ignore case.\n\nInput format:\n- A single line containing a string\n\nOutput format:\n- "true" or "false"',
    difficulty: 'Easy',
    category: 'Strings',
    tags: ['String', 'Two Pointers'],
    constraints: '1 <= s.length <= 2 * 10^5\ns consists of printable ASCII characters.',
    examples: [
      { input: 'A man a plan a canal Panama', output: 'true', isExample: true },
      { input: 'race a car', output: 'false', isExample: true }
    ],
    hiddenTestCases: [
      { input: 'a', output: 'true', isExample: false },
      { input: 'ab', output: 'false', isExample: false },
      { input: 'abba', output: 'true', isExample: false },
      { input: 'Was it a car or a cat I saw', output: 'true', isExample: false }
    ],
    starterCode: {
      python: 's = input()\nfiltered = "".join(c.lower() for c in s if c.isalnum())\nprint("true" if filtered == filtered[::-1] else "false")\n',
      cpp: '#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    string f;\n    for (char c : s)\n        if (isalnum(c)) f += tolower(c);\n    string r(f.rbegin(), f.rend());\n    cout << (f == r ? "true" : "false") << endl;\n    return 0;\n}\n',
      java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine();\n        String f = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();\n        String r = new StringBuilder(f).reverse().toString();\n        System.out.println(f.equals(r) ? "true" : "false");\n    }\n}\n'
    }
  },
  {
    title: 'Count Vowels',
    description: 'Given a string, count the number of vowels (a, e, i, o, u) in it. Case-insensitive.\n\nInput format:\n- A single line containing a string\n\nOutput format:\n- A single integer (the count of vowels)',
    difficulty: 'Easy',
    category: 'Strings',
    tags: ['String', 'Counting'],
    constraints: '1 <= s.length <= 10^5\ns contains printable ASCII characters.',
    examples: [
      { input: 'hello world', output: '3', isExample: true },
      { input: 'AEIOU', output: '5', isExample: true }
    ],
    hiddenTestCases: [
      { input: 'bcdfg', output: '0', isExample: false },
      { input: 'a', output: '1', isExample: false },
      { input: 'Programming is fun', output: '5', isExample: false }
    ],
    starterCode: {
      python: 's = input()\nprint(sum(1 for c in s.lower() if c in "aeiou"))\n',
      cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    getline(cin, s);\n    int count = 0;\n    for (char c : s) {\n        char lc = tolower(c);\n        if (lc == \'a\' || lc == \'e\' || lc == \'i\' || lc == \'o\' || lc == \'u\') count++;\n    }\n    cout << count << endl;\n    return 0;\n}\n',
      java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().toLowerCase();\n        int count = 0;\n        for (char c : s.toCharArray())\n            if ("aeiou".indexOf(c) >= 0) count++;\n        System.out.println(count);\n    }\n}\n'
    }
  },
  {
    title: 'Find Maximum Element',
    description: 'Given an array of integers, find and print the maximum element.\n\nInput format:\n- A single line of space-separated integers\n\nOutput format:\n- A single integer (the maximum element)',
    difficulty: 'Easy',
    category: 'Arrays',
    tags: ['Array', 'Basics'],
    constraints: '1 <= arr.length <= 10^5\n-10^9 <= arr[i] <= 10^9',
    examples: [
      { input: '3 1 4 1 5 9 2 6', output: '9', isExample: true },
      { input: '-5 -2 -8 -1', output: '-1', isExample: true }
    ],
    hiddenTestCases: [
      { input: '42', output: '42', isExample: false },
      { input: '1 2 3 4 5', output: '5', isExample: false },
      { input: '100 -100 50 -50', output: '100', isExample: false }
    ],
    starterCode: {
      python: 'nums = list(map(int, input().split()))\nprint(max(nums))\n',
      cpp: '#include <iostream>\n#include <sstream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n    istringstream iss(line);\n    vector<int> nums;\n    int x;\n    while (iss >> x) nums.push_back(x);\n    cout << *max_element(nums.begin(), nums.end()) << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] parts = sc.nextLine().trim().split("\\\\s+");\n        int max = Integer.MIN_VALUE;\n        for (String p : parts) max = Math.max(max, Integer.parseInt(p));\n        System.out.println(max);\n    }\n}\n'
    }
  },
  {
    title: 'Sum of Digits',
    description: 'Given a non-negative integer, find the sum of its digits.\n\nInput format:\n- A single non-negative integer\n\nOutput format:\n- A single integer (the sum of digits)',
    difficulty: 'Easy',
    category: 'Math',
    tags: ['Math', 'Basics'],
    constraints: '0 <= n <= 10^18',
    examples: [
      { input: '123', output: '6', isExample: true },
      { input: '9999', output: '36', isExample: true }
    ],
    hiddenTestCases: [
      { input: '0', output: '0', isExample: false },
      { input: '5', output: '5', isExample: false },
      { input: '1000000007', output: '8', isExample: false }
    ],
    starterCode: {
      python: 'n = input().strip()\nprint(sum(int(d) for d in n))\n',
      cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string n;\n    cin >> n;\n    int sum = 0;\n    for (char c : n) sum += c - \'0\';\n    cout << sum << endl;\n    return 0;\n}\n',
      java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String n = sc.next();\n        int sum = 0;\n        for (char c : n.toCharArray()) sum += c - \'0\';\n        System.out.println(sum);\n    }\n}\n'
    }
  },
  {
    title: 'Binary Search',
    description: 'Given a sorted array of distinct integers and a target, find the index of the target. If not found, print -1.\n\nInput format:\n- First line: space-separated sorted integers\n- Second line: an integer (target)\n\nOutput format:\n- The index of the target (0-based), or -1 if not found',
    difficulty: 'Easy',
    category: 'Searching',
    tags: ['Binary Search', 'Array'],
    constraints: '1 <= arr.length <= 10^4\n-10^4 <= arr[i] <= 10^4\nAll elements are distinct and sorted.',
    examples: [
      { input: '-1 0 3 5 9 12\n9', output: '4', isExample: true },
      { input: '-1 0 3 5 9 12\n2', output: '-1', isExample: true }
    ],
    hiddenTestCases: [
      { input: '1\n1', output: '0', isExample: false },
      { input: '1 3 5 7 9\n7', output: '3', isExample: false },
      { input: '2 4 6 8 10\n1', output: '-1', isExample: false }
    ],
    starterCode: {
      python: 'nums = list(map(int, input().split()))\ntarget = int(input())\nlo, hi = 0, len(nums) - 1\nresult = -1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if nums[mid] == target:\n        result = mid\n        break\n    elif nums[mid] < target:\n        lo = mid + 1\n    else:\n        hi = mid - 1\nprint(result)\n',
      cpp: '#include <iostream>\n#include <sstream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n    istringstream iss(line);\n    vector<int> nums;\n    int x;\n    while (iss >> x) nums.push_back(x);\n    int target;\n    cin >> target;\n    int lo = 0, hi = nums.size() - 1, result = -1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;\n        if (nums[mid] == target) { result = mid; break; }\n        else if (nums[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    cout << result << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] parts = sc.nextLine().trim().split("\\\\s+");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        int target = Integer.parseInt(sc.nextLine().trim());\n        int lo = 0, hi = nums.length - 1, result = -1;\n        while (lo <= hi) {\n            int mid = (lo + hi) / 2;\n            if (nums[mid] == target) { result = mid; break; }\n            else if (nums[mid] < target) lo = mid + 1;\n            else hi = mid - 1;\n        }\n        System.out.println(result);\n    }\n}\n'
    }
  },
  {
    title: 'Merge Sorted Arrays',
    description: 'Given two sorted arrays of integers, merge them into one sorted array.\n\nInput format:\n- First line: space-separated integers (first sorted array)\n- Second line: space-separated integers (second sorted array)\n\nOutput format:\n- A single line of space-separated integers (merged sorted array)',
    difficulty: 'Medium',
    category: 'Arrays',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    constraints: '0 <= arr1.length, arr2.length <= 10^4\n-10^6 <= arr[i] <= 10^6',
    examples: [
      { input: '1 3 5 7\n2 4 6 8', output: '1 2 3 4 5 6 7 8', isExample: true },
      { input: '1 2 3\n4 5 6', output: '1 2 3 4 5 6', isExample: true }
    ],
    hiddenTestCases: [
      { input: '1\n2', output: '1 2', isExample: false },
      { input: '1 1 1\n1 1 1', output: '1 1 1 1 1 1', isExample: false },
      { input: '-5 0 5\n-3 3 10', output: '-5 -3 0 3 5 10', isExample: false }
    ],
    starterCode: {
      python: 'a = list(map(int, input().split()))\nb = list(map(int, input().split()))\nresult = []\ni = j = 0\nwhile i < len(a) and j < len(b):\n    if a[i] <= b[j]:\n        result.append(a[i])\n        i += 1\n    else:\n        result.append(b[j])\n        j += 1\nresult.extend(a[i:])\nresult.extend(b[j:])\nprint(" ".join(map(str, result)))\n',
      cpp: '#include <iostream>\n#include <sstream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string line1, line2;\n    getline(cin, line1);\n    getline(cin, line2);\n    vector<int> a, b;\n    int x;\n    istringstream s1(line1);\n    while (s1 >> x) a.push_back(x);\n    istringstream s2(line2);\n    while (s2 >> x) b.push_back(x);\n    vector<int> res;\n    int i = 0, j = 0;\n    while (i < a.size() && j < b.size()) {\n        if (a[i] <= b[j]) res.push_back(a[i++]);\n        else res.push_back(b[j++]);\n    }\n    while (i < a.size()) res.push_back(a[i++]);\n    while (j < b.size()) res.push_back(b[j++]);\n    for (int k = 0; k < res.size(); k++) {\n        if (k) cout << " ";\n        cout << res[k];\n    }\n    cout << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] p1 = sc.nextLine().trim().split("\\\\s+");\n        String[] p2 = sc.nextLine().trim().split("\\\\s+");\n        int[] a = new int[p1.length], b = new int[p2.length];\n        for (int i = 0; i < p1.length; i++) a[i] = Integer.parseInt(p1[i]);\n        for (int i = 0; i < p2.length; i++) b[i] = Integer.parseInt(p2[i]);\n        int i = 0, j = 0;\n        StringBuilder sb = new StringBuilder();\n        while (i < a.length && j < b.length) {\n            if (a[i] <= b[j]) sb.append(a[i++]);\n            else sb.append(b[j++]);\n            sb.append(" ");\n        }\n        while (i < a.length) { sb.append(a[i++]); sb.append(" "); }\n        while (j < b.length) { sb.append(b[j++]); sb.append(" "); }\n        System.out.println(sb.toString().trim());\n    }\n}\n'
    }
  },
  {
    title: 'Power of Two',
    description: 'Given an integer n, determine if it is a power of two.\n\nInput format:\n- A single integer n\n\nOutput format:\n- "true" or "false"',
    difficulty: 'Easy',
    category: 'Math',
    tags: ['Math', 'Bit Manipulation'],
    constraints: '-2^31 <= n <= 2^31 - 1',
    examples: [
      { input: '1', output: 'true', isExample: true },
      { input: '16', output: 'true', isExample: true },
      { input: '3', output: 'false', isExample: true }
    ],
    hiddenTestCases: [
      { input: '0', output: 'false', isExample: false },
      { input: '-1', output: 'false', isExample: false },
      { input: '1024', output: 'true', isExample: false },
      { input: '6', output: 'false', isExample: false }
    ],
    starterCode: {
      python: 'n = int(input())\nprint("true" if n > 0 and (n & (n - 1)) == 0 else "false")\n',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n    cout << (n > 0 && (n & (n - 1)) == 0 ? "true" : "false") << endl;\n    return 0;\n}\n',
      java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        System.out.println(n > 0 && (n & (n - 1)) == 0 ? "true" : "false");\n    }\n}\n'
    }
  },
  {
    title: 'Remove Duplicates from Sorted Array',
    description: 'Given a sorted array of integers, remove duplicates in-place and print the unique elements.\n\nInput format:\n- A single line of space-separated sorted integers\n\nOutput format:\n- A single line of space-separated unique integers',
    difficulty: 'Easy',
    category: 'Arrays',
    tags: ['Array', 'Two Pointers'],
    constraints: '1 <= nums.length <= 3 * 10^4\n-100 <= nums[i] <= 100\nnums is sorted in non-decreasing order.',
    examples: [
      { input: '1 1 2', output: '1 2', isExample: true },
      { input: '0 0 1 1 1 2 2 3 3 4', output: '0 1 2 3 4', isExample: true }
    ],
    hiddenTestCases: [
      { input: '1', output: '1', isExample: false },
      { input: '1 2 3', output: '1 2 3', isExample: false },
      { input: '-1 -1 0 0 1 1', output: '-1 0 1', isExample: false }
    ],
    starterCode: {
      python: 'nums = list(map(int, input().split()))\nseen = []\nfor n in nums:\n    if not seen or seen[-1] != n:\n        seen.append(n)\nprint(" ".join(map(str, seen)))\n',
      cpp: '#include <iostream>\n#include <sstream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n    istringstream iss(line);\n    vector<int> nums;\n    int x;\n    while (iss >> x) nums.push_back(x);\n    vector<int> res;\n    for (int n : nums)\n        if (res.empty() || res.back() != n) res.push_back(n);\n    for (int i = 0; i < res.size(); i++) {\n        if (i) cout << " ";\n        cout << res[i];\n    }\n    cout << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] parts = sc.nextLine().trim().split("\\\\s+");\n        List<Integer> res = new ArrayList<>();\n        for (String p : parts) {\n            int n = Integer.parseInt(p);\n            if (res.isEmpty() || res.get(res.size() - 1) != n) res.add(n);\n        }\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < res.size(); i++) {\n            if (i > 0) sb.append(" ");\n            sb.append(res.get(i));\n        }\n        System.out.println(sb.toString());\n    }\n}\n'
    }
  },
  {
    title: 'Factorial',
    description: 'Given a non-negative integer n, compute n! (n factorial).\n\nInput format:\n- A single integer n\n\nOutput format:\n- A single integer n!',
    difficulty: 'Easy',
    category: 'Math',
    tags: ['Math', 'Recursion'],
    constraints: '0 <= n <= 20',
    examples: [
      { input: '5', output: '120', isExample: true },
      { input: '0', output: '1', isExample: true }
    ],
    hiddenTestCases: [
      { input: '1', output: '1', isExample: false },
      { input: '10', output: '3628800', isExample: false },
      { input: '15', output: '1307674368000', isExample: false }
    ],
    starterCode: {
      python: 'n = int(input())\nresult = 1\nfor i in range(2, n + 1):\n    result *= i\nprint(result)\n',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    long long result = 1;\n    for (int i = 2; i <= n; i++) result *= i;\n    cout << result << endl;\n    return 0;\n}\n',
      java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        long result = 1;\n        for (int i = 2; i <= n; i++) result *= i;\n        System.out.println(result);\n    }\n}\n'
    }
  },
  {
    title: 'Longest Common Prefix',
    description: 'Given a list of strings, find the longest common prefix among them.\n\nInput format:\n- First line: an integer n (number of strings)\n- Next n lines: one string per line\n\nOutput format:\n- The longest common prefix. If there is no common prefix, print an empty line.',
    difficulty: 'Easy',
    category: 'Strings',
    tags: ['String'],
    constraints: '1 <= n <= 200\n0 <= strs[i].length <= 200\nstrs[i] consists of only lowercase English letters.',
    examples: [
      { input: '3\nflower\nflow\nflight', output: 'fl', isExample: true },
      { input: '3\ndog\nracecar\ncar', output: '', isExample: true }
    ],
    hiddenTestCases: [
      { input: '1\nhello', output: 'hello', isExample: false },
      { input: '2\naa\naa', output: 'aa', isExample: false },
      { input: '3\nabc\nabd\nabe', output: 'ab', isExample: false }
    ],
    starterCode: {
      python: 'n = int(input())\nstrs = [input() for _ in range(n)]\nif not strs:\n    print("")\nelse:\n    prefix = strs[0]\n    for s in strs[1:]:\n        while not s.startswith(prefix):\n            prefix = prefix[:-1]\n            if not prefix:\n                break\n    print(prefix)\n',
      cpp: '#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    cin.ignore();\n    vector<string> strs(n);\n    for (int i = 0; i < n; i++) getline(cin, strs[i]);\n    string prefix = strs[0];\n    for (int i = 1; i < n; i++) {\n        while (strs[i].find(prefix) != 0) {\n            prefix = prefix.substr(0, prefix.size() - 1);\n            if (prefix.empty()) break;\n        }\n    }\n    cout << prefix << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        String[] strs = new String[n];\n        for (int i = 0; i < n; i++) strs[i] = sc.nextLine();\n        String prefix = strs[0];\n        for (int i = 1; i < n; i++) {\n            while (!strs[i].startsWith(prefix)) {\n                prefix = prefix.substring(0, prefix.length() - 1);\n                if (prefix.isEmpty()) break;\n            }\n        }\n        System.out.println(prefix);\n    }\n}\n'
    }
  },
  {
    title: 'Matrix Transpose',
    description: 'Given a matrix, print its transpose.\n\nInput format:\n- First line: two integers r and c (rows and columns)\n- Next r lines: c space-separated integers per line\n\nOutput format:\n- c lines, each containing r space-separated integers',
    difficulty: 'Medium',
    category: 'Arrays',
    tags: ['Array', 'Matrix'],
    constraints: '1 <= r, c <= 100\n-1000 <= matrix[i][j] <= 1000',
    examples: [
      { input: '2 3\n1 2 3\n4 5 6', output: '1 4\n2 5\n3 6', isExample: true }
    ],
    hiddenTestCases: [
      { input: '1 1\n5', output: '5', isExample: false },
      { input: '3 3\n1 2 3\n4 5 6\n7 8 9', output: '1 4 7\n2 5 8\n3 6 9', isExample: false },
      { input: '1 3\n10 20 30', output: '10\n20\n30', isExample: false }
    ],
    starterCode: {
      python: 'r, c = map(int, input().split())\nmatrix = []\nfor _ in range(r):\n    matrix.append(list(map(int, input().split())))\nfor j in range(c):\n    print(" ".join(str(matrix[i][j]) for i in range(r)))\n',
      cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int r, c;\n    cin >> r >> c;\n    vector<vector<int>> m(r, vector<int>(c));\n    for (int i = 0; i < r; i++)\n        for (int j = 0; j < c; j++)\n            cin >> m[i][j];\n    for (int j = 0; j < c; j++) {\n        for (int i = 0; i < r; i++) {\n            if (i) cout << " ";\n            cout << m[i][j];\n        }\n        cout << endl;\n    }\n    return 0;\n}\n',
      java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int r = sc.nextInt(), c = sc.nextInt();\n        int[][] m = new int[r][c];\n        for (int i = 0; i < r; i++)\n            for (int j = 0; j < c; j++)\n                m[i][j] = sc.nextInt();\n        for (int j = 0; j < c; j++) {\n            StringBuilder sb = new StringBuilder();\n            for (int i = 0; i < r; i++) {\n                if (i > 0) sb.append(" ");\n                sb.append(m[i][j]);\n            }\n            System.out.println(sb.toString());\n        }\n    }\n}\n'
    }
  },
  {
    title: 'GCD of Two Numbers',
    description: 'Given two positive integers, find their Greatest Common Divisor (GCD).\n\nInput format:\n- Two space-separated positive integers\n\nOutput format:\n- A single integer (the GCD)',
    difficulty: 'Easy',
    category: 'Math',
    tags: ['Math', 'Euclidean Algorithm'],
    constraints: '1 <= a, b <= 10^9',
    examples: [
      { input: '12 8', output: '4', isExample: true },
      { input: '100 75', output: '25', isExample: true }
    ],
    hiddenTestCases: [
      { input: '1 1', output: '1', isExample: false },
      { input: '17 13', output: '1', isExample: false },
      { input: '1000000000 500000000', output: '500000000', isExample: false }
    ],
    starterCode: {
      python: 'a, b = map(int, input().split())\nwhile b:\n    a, b = b, a % b\nprint(a)\n',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    long long a, b;\n    cin >> a >> b;\n    while (b) {\n        long long t = b;\n        b = a % b;\n        a = t;\n    }\n    cout << a << endl;\n    return 0;\n}\n',
      java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long a = sc.nextLong(), b = sc.nextLong();\n        while (b != 0) {\n            long t = b;\n            b = a % b;\n            a = t;\n        }\n        System.out.println(a);\n    }\n}\n'
    }
  },
  {
    title: 'Check Prime',
    description: 'Given a positive integer n, determine if it is a prime number.\n\nInput format:\n- A single positive integer n\n\nOutput format:\n- "true" if n is prime, "false" otherwise',
    difficulty: 'Easy',
    category: 'Math',
    tags: ['Math', 'Number Theory'],
    constraints: '1 <= n <= 10^9',
    examples: [
      { input: '7', output: 'true', isExample: true },
      { input: '10', output: 'false', isExample: true }
    ],
    hiddenTestCases: [
      { input: '1', output: 'false', isExample: false },
      { input: '2', output: 'true', isExample: false },
      { input: '997', output: 'true', isExample: false },
      { input: '100', output: 'false', isExample: false }
    ],
    starterCode: {
      python: 'n = int(input())\nif n < 2:\n    print("false")\nelse:\n    is_prime = True\n    i = 2\n    while i * i <= n:\n        if n % i == 0:\n            is_prime = False\n            break\n        i += 1\n    print("true" if is_prime else "false")\n',
      cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    long long n;\n    cin >> n;\n    if (n < 2) { cout << "false" << endl; return 0; }\n    for (long long i = 2; i * i <= n; i++) {\n        if (n % i == 0) { cout << "false" << endl; return 0; }\n    }\n    cout << "true" << endl;\n    return 0;\n}\n',
      java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long n = sc.nextLong();\n        if (n < 2) { System.out.println("false"); return; }\n        for (long i = 2; i * i <= n; i++) {\n            if (n % i == 0) { System.out.println("false"); return; }\n        }\n        System.out.println("true");\n    }\n}\n'
    }
  },
  {
    title: 'Container With Most Water',
    description: 'Given n non-negative integers representing heights of vertical lines, find two lines that together with the x-axis form a container that holds the most water.\n\nInput format:\n- A single line of space-separated non-negative integers\n\nOutput format:\n- A single integer (the maximum area)',
    difficulty: 'Medium',
    category: 'Arrays',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    constraints: '2 <= height.length <= 10^5\n0 <= height[i] <= 10^4',
    examples: [
      { input: '1 8 6 2 5 4 8 3 7', output: '49', isExample: true },
      { input: '1 1', output: '1', isExample: true }
    ],
    hiddenTestCases: [
      { input: '4 3 2 1 4', output: '16', isExample: false },
      { input: '1 2 1', output: '2', isExample: false },
      { input: '2 3 10 5 7 8 9', output: '36', isExample: false }
    ],
    starterCode: {
      python: 'height = list(map(int, input().split()))\nleft, right = 0, len(height) - 1\nmax_area = 0\nwhile left < right:\n    area = min(height[left], height[right]) * (right - left)\n    max_area = max(max_area, area)\n    if height[left] < height[right]:\n        left += 1\n    else:\n        right -= 1\nprint(max_area)\n',
      cpp: '#include <iostream>\n#include <sstream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n    istringstream iss(line);\n    vector<int> h;\n    int x;\n    while (iss >> x) h.push_back(x);\n    int l = 0, r = h.size() - 1, ans = 0;\n    while (l < r) {\n        ans = max(ans, min(h[l], h[r]) * (r - l));\n        if (h[l] < h[r]) l++;\n        else r--;\n    }\n    cout << ans << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] parts = sc.nextLine().trim().split("\\\\s+");\n        int[] h = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) h[i] = Integer.parseInt(parts[i]);\n        int l = 0, r = h.length - 1, ans = 0;\n        while (l < r) {\n            ans = Math.max(ans, Math.min(h[l], h[r]) * (r - l));\n            if (h[l] < h[r]) l++;\n            else r--;\n        }\n        System.out.println(ans);\n    }\n}\n'
    }
  },
  {
    title: 'Linked List Cycle Detection',
    description: 'Given a sequence of integers representing node values and an integer pos (0-indexed) indicating where the tail connects to, determine if there is a cycle. pos = -1 means no cycle.\n\nInput format:\n- First line: space-separated integers (node values)\n- Second line: an integer pos (-1 if no cycle)\n\nOutput format:\n- "true" if there is a cycle, "false" otherwise',
    difficulty: 'Medium',
    category: 'Linked List',
    tags: ['Linked List', 'Two Pointers'],
    constraints: '0 <= list size <= 10^4\n-10^5 <= node value <= 10^5\npos is -1 or a valid index.',
    examples: [
      { input: '3 2 0 -4\n1', output: 'true', isExample: true },
      { input: '1 2\n-1', output: 'false', isExample: true }
    ],
    hiddenTestCases: [
      { input: '1\n-1', output: 'false', isExample: false },
      { input: '1 2 3 4 5\n0', output: 'true', isExample: false },
      { input: '1\n0', output: 'true', isExample: false }
    ],
    starterCode: {
      python: 'vals = list(map(int, input().split()))\npos = int(input())\nprint("true" if pos >= 0 else "false")\n',
      cpp: '#include <iostream>\n#include <sstream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    string line;\n    getline(cin, line);\n    int pos;\n    cin >> pos;\n    cout << (pos >= 0 ? "true" : "false") << endl;\n    return 0;\n}\n',
      java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        sc.nextLine();\n        int pos = Integer.parseInt(sc.nextLine().trim());\n        System.out.println(pos >= 0 ? "true" : "false");\n    }\n}\n'
    }
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/algoforge');
    console.log('MongoDB connected');

    await Problem.deleteMany({});
    console.log('Cleared existing problems');

    await Problem.insertMany(sampleProblems);
    console.log(`Successfully seeded ${sampleProblems.length} problems`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  seedDatabase();
}
