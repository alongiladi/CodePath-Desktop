import { Course, Lesson, Exercise, Quiz, Achievement, MentorMessage, DailyActivity, TopicProficiency, UserProfile } from '../types';

export const INITIAL_USER: UserProfile = {
  name: 'Alex',
  email: 'alex.dev@codepath.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  level: 'Beginner+',
  xp: 1240,
  streak: 7,
  streakActiveToday: true,
  totalHours: 14.5,
  language: 'en',
  activeCourseId: 'python-beginners',
  activeLessonId: 'python-13',
  activeExerciseId: 'ex-python-while-1',
  activeQuizId: 'quiz-python-loops',
  completedLessons: [
    'python-1', 'python-2', 'python-3', 'python-4',
    'python-5', 'python-6', 'python-7', 'python-8',
    'python-9', 'python-10', 'python-11', 'python-12'
  ],
  completedExercises: ['ex-python-intro', 'ex-python-vars', 'ex-python-if-else'],
  completedArchitectureChallenges: ['arch-n-plus-one'],
  quizScores: {
    'quiz-python-basics': { score: 5, total: 5, percentage: 100 },
    'quiz-python-ifs': { score: 4, total: 5, percentage: 80 },
  },
  unlockedAchievements: ['ach-streak-7', 'ach-first-run', 'ach-quiz-ace', 'ach-syntax-explorer'],
  dailyGoalMinutes: 15,
  editorFontSize: 'md',
  soundEnabled: true,
};

export const COURSES: Course[] = [
  {
    id: 'python-beginners',
    title: 'Python for Beginners',
    description: 'Learn computational thinking, clean syntax, loops, and conditions with gentle, hands-on micro-challenges.',
    difficulty: 'Beginner',
    category: 'Python',
    totalLessons: 28,
    estimatedHours: 8,
    iconName: 'Terminal',
    badge: 'Popular',
    tags: ['Beginner', 'Practical', 'Interactive'],
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Foundations & Variables',
        description: 'Set up your mind for code, store data, and print results.',
        lessons: [
          { id: 'python-1', title: 'Say Hello to Python', durationMinutes: 5, order: 1, type: 'concept' },
          { id: 'python-2', title: 'Variables and Storage', durationMinutes: 6, order: 2, type: 'practice' },
          { id: 'python-3', title: 'Data Types: Strings & Ints', durationMinutes: 8, order: 3, type: 'concept' },
          { id: 'python-4', title: 'Arithmetic Operations', durationMinutes: 7, order: 4, type: 'practice' },
        ],
      },
      {
        id: 'mod-2',
        title: 'Module 2: Decisions & Branching',
        description: 'Make your program choose different paths using if-statements.',
        lessons: [
          { id: 'python-5', title: 'Boolean Logic & Comparisons', durationMinutes: 6, order: 5, type: 'concept' },
          { id: 'python-6', title: 'The if-Statement', durationMinutes: 7, order: 6, type: 'practice' },
          { id: 'python-7', title: 'else and elif Branches', durationMinutes: 8, order: 7, type: 'concept' },
          { id: 'python-8', title: 'Combining Logic with and / or', durationMinutes: 8, order: 8, type: 'practice' },
        ],
      },
      {
        id: 'mod-3',
        title: 'Module 3: Repetition & Loops',
        description: 'Automate repetitive tasks with while and for loops.',
        lessons: [
          { id: 'python-9', title: 'Why Programs Need Loops', durationMinutes: 5, order: 9, type: 'concept' },
          { id: 'python-10', title: 'String Manipulation & Slicing', durationMinutes: 7, order: 10, type: 'concept' },
          { id: 'python-11', title: 'Conditional Logic in Real Scenarios', durationMinutes: 8, order: 11, type: 'practice' },
          { id: 'python-12', title: 'Comparison Operators & Booleans', durationMinutes: 6, order: 12, type: 'quiz' },
          { id: 'python-13', title: 'Loops and Conditions', durationMinutes: 10, order: 13, type: 'practice' },
          { id: 'python-14', title: 'The For Loop & Range Function', durationMinutes: 9, order: 14, type: 'concept' },
          { id: 'python-15', title: 'Loop Control: Break and Continue', durationMinutes: 8, order: 15, type: 'practice' },
        ],
      },
    ],
  },
  {
    id: 'javascript-beginners',
    title: 'JavaScript for Beginners',
    description: 'Breathe life into web pages. Master variables, arrow functions, DOM events, and basic array methods.',
    difficulty: 'Beginner',
    category: 'JavaScript',
    totalLessons: 24,
    estimatedHours: 10,
    iconName: 'Code',
    badge: 'Popular',
    tags: ['Beginner', 'Frontend', 'Web'],
    modules: [
      {
        id: 'js-mod-1',
        title: 'JavaScript Building Blocks',
        description: 'Console, variables (let/const), and dynamic types.',
        lessons: [
          { id: 'js-1', title: 'Welcome to JavaScript', durationMinutes: 6, order: 1, type: 'concept' },
          { id: 'js-2', title: 'Declaring Variables with const & let', durationMinutes: 7, order: 2, type: 'practice' },
        ],
      },
    ],
  },
  {
    id: 'sql-fundamentals',
    title: 'SQL & Database Queries',
    description: 'Learn how modern applications query millions of rows with SELECT, WHERE, JOINs, and aggregates.',
    difficulty: 'Beginner',
    category: 'SQL',
    totalLessons: 18,
    estimatedHours: 6,
    iconName: 'Database',
    badge: 'Practical',
    tags: ['Data', 'Practical', 'Backend'],
    modules: [
      {
        id: 'sql-mod-1',
        title: 'Querying Data with SELECT',
        description: 'Extracting specific columns and filtering records.',
        lessons: [
          { id: 'sql-1', title: 'Your First SELECT Query', durationMinutes: 6, order: 1, type: 'concept' },
          { id: 'sql-2', title: 'Filtering with WHERE Clauses', durationMinutes: 8, order: 2, type: 'practice' },
        ],
      },
    ],
  },
  {
    id: 'html-css-essentials',
    title: 'HTML & Modern CSS',
    description: 'Structure modern layouts with semantic HTML5 and style them with Flexbox, CSS Grid, and custom colors.',
    difficulty: 'Beginner',
    category: 'Web',
    totalLessons: 16,
    estimatedHours: 5,
    iconName: 'Layout',
    badge: 'Beginner',
    tags: ['Design', 'UI', 'Beginner'],
    modules: [
      {
        id: 'html-mod-1',
        title: 'Semantic Foundations',
        description: 'Tags, headers, forms, and layout hierarchy.',
        lessons: [
          { id: 'html-1', title: 'Document Structure', durationMinutes: 5, order: 1, type: 'concept' },
        ],
      },
    ],
  },
  {
    id: 'git-fundamentals',
    title: 'Git & Version Control',
    description: 'Never lose work again. Understand repositories, staging, commits, branches, and resolving merge conflicts.',
    difficulty: 'Intermediate',
    category: 'Git',
    totalLessons: 12,
    estimatedHours: 4,
    iconName: 'GitBranch',
    badge: 'Practical',
    tags: ['DevTools', 'Practical', 'Career'],
    modules: [
      {
        id: 'git-mod-1',
        title: 'Snapshots & History',
        description: 'git init, add, commit, and log essentials.',
        lessons: [
          { id: 'git-1', title: 'What is a Repository?', durationMinutes: 6, order: 1, type: 'concept' },
        ],
      },
    ],
  },
  {
    id: 'game-dev-canvas',
    title: 'Introduction to Game Development',
    description: 'Create interactive 2D arcade games from scratch using the 60fps game loop, sprites, and physics.',
    difficulty: 'Intermediate',
    category: 'Game Dev',
    totalLessons: 20,
    estimatedHours: 12,
    iconName: 'Gamepad2',
    badge: 'Popular',
    tags: ['Creative', 'Game Dev', 'Interactive'],
    modules: [
      {
        id: 'game-mod-1',
        title: 'The 60 FPS Game Loop',
        description: 'Clear, update, and draw cycles on HTML5 Canvas.',
        lessons: [
          { id: 'game-1', title: 'The Heartbeat of a Game', durationMinutes: 8, order: 1, type: 'concept' },
        ],
      },
    ],
  },
];

export const LESSONS: Record<string, Lesson> = {
  'python-13': {
    id: 'python-13',
    courseId: 'python-beginners',
    courseTitle: 'Python for Beginners',
    order: 13,
    totalInCourse: 28,
    title: 'Loops and Conditions',
    subtitle: 'Learn how while loops test a condition before every single cycle to automate work.',
    conceptTitle: 'Automating Repetition with while Loops',
    explanation: [
      'Computers excel at doing repetitive chores millions of times without fatigue. In Python, a while loop repeats a block of code as long as a specified condition evaluates to True.',
      'Before each repetition (called an iteration), Python evaluates the test condition. If the condition is True, the indented body runs. If it evaluates to False, Python skips straight to the next lines after the loop.',
      'To prevent an infinite loop, you must ensure that something inside the loop modifies a variable so the condition eventually turns False.'
    ],
    realWorldAnalogy: 'Think of pouring water into a glass: while the glass is not full, you keep pouring. As soon as the water reaches the rim (condition is no longer True), you stop pouring.',
    codeSnippet: `# Initialize our starting tracker
counter = 1

# Repeat as long as counter is 5 or less
while counter <= 5:
    print(f"Cycle number: {counter}")
    # Crucial step: increment counter by 1
    counter += 1

print("Loop finished successfully!")`,
    language: 'python',
    simulatedOutput: `Cycle number: 1
Cycle number: 2
Cycle number: 3
Cycle number: 4
Cycle number: 5
Loop finished successfully!`,
    lineBreakdown: [
      {
        lineNumber: 2,
        code: 'counter = 1',
        explanation: 'We create a state variable called counter and give it an initial value of 1.',
      },
      {
        lineNumber: 5,
        code: 'while counter <= 5:',
        explanation: 'The loop condition. Python asks: "Is counter less than or equal to 5?" If yes, execute the indented block below.',
      },
      {
        lineNumber: 6,
        code: '    print(f"Cycle number: {counter}")',
        explanation: 'Indented 4 spaces. Displays the current iteration count on the console.',
      },
      {
        lineNumber: 8,
        code: '    counter += 1',
        explanation: 'Short for counter = counter + 1. Increments our number so we eventually reach 6 and exit the loop.',
      },
      {
        lineNumber: 10,
        code: 'print("Loop finished successfully!")',
        explanation: 'Notice this is not indented. It only runs after the while loop has completed all cycles.',
      },
    ],
    importantTip: {
      title: 'Beware of the Infinite Loop Trap',
      description: 'If you forget to increment your counter (line 8), counter will always stay 1, meaning counter <= 5 will always be True, running forever. Always ensure your loop has a clear exit pathway!',
    },
    exerciseId: 'ex-python-while-1',
    quizId: 'quiz-python-loops',
    nextLessonId: 'python-14',
    prevLessonId: 'python-12',
  },
  'python-10': {
    id: 'python-10',
    courseId: 'python-beginners',
    courseTitle: 'Python for Beginners',
    order: 10,
    totalInCourse: 28,
    title: 'String Manipulation & Slicing',
    subtitle: 'Extract substrings, convert case, and format text like a pro.',
    conceptTitle: 'Working with Text Sequences',
    explanation: [
      'In Python, strings are ordered collections of characters. You can inspect individual characters using index brackets like text[0].',
      'Using slice notation text[start:end], you can grab any sub-segment without altering the original string.'
    ],
    codeSnippet: `message = "Hello, CodePath!"
print(message.upper())
print(message[0:5]) # Extracts "Hello"`,
    language: 'python',
    simulatedOutput: `HELLO, CODEPATH!
Hello`,
    lineBreakdown: [
      { lineNumber: 1, code: 'message = "Hello, CodePath!"', explanation: 'Stores a greeting string in memory.' },
      { lineNumber: 2, code: 'print(message.upper())', explanation: 'Invokes upper() method to print in capital letters.' },
      { lineNumber: 3, code: 'print(message[0:5])', explanation: 'Slices from index 0 up to index 5.' },
    ],
    importantTip: {
      title: 'Python uses 0-based indexing',
      description: 'The very first character of every string sits at index 0, not 1.',
    },
    exerciseId: 'ex-python-while-1',
    quizId: 'quiz-python-loops',
    nextLessonId: 'python-11',
    prevLessonId: 'python-9',
  },
  'python-11': {
    id: 'python-11',
    courseId: 'python-beginners',
    courseTitle: 'Python for Beginners',
    order: 11,
    totalInCourse: 28,
    title: 'Conditional Logic: If, Elif, Else',
    subtitle: 'Directing your program down different branches based on runtime data.',
    conceptTitle: 'Multi-Way Decision Making',
    explanation: [
      'When your app faces multiple possibilities (like grading a test: A, B, C, or F), elif gives you orderly step-by-step checking.',
      'As soon as one condition evaluates to True, Python executes that block and ignores all subsequent branches.'
    ],
    codeSnippet: `score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"

print(f"Final Grade: {grade}")`,
    language: 'python',
    simulatedOutput: `Final Grade: B`,
    lineBreakdown: [
      { lineNumber: 1, code: 'score = 85', explanation: 'Creates integer score.' },
      { lineNumber: 3, code: 'if score >= 90:', explanation: 'Evaluates to False since 85 is less than 90.' },
      { lineNumber: 5, code: 'elif score >= 80:', explanation: 'Evaluates to True (85 >= 80). Python assigns grade = "B".' },
      { lineNumber: 10, code: 'print(f"Final Grade: {grade}")', explanation: 'Outputs the final assigned letter.' },
    ],
    importantTip: {
      title: 'Order matters with elif',
      description: 'Always put your most specific or highest boundary checks first, because Python stops checking once it finds the first match.',
    },
    exerciseId: 'ex-python-while-1',
    quizId: 'quiz-python-loops',
    nextLessonId: 'python-12',
    prevLessonId: 'python-10',
  },
  'python-12': {
    id: 'python-12',
    courseId: 'python-beginners',
    courseTitle: 'Python for Beginners',
    order: 12,
    totalInCourse: 28,
    title: 'Comparison Operators & Booleans',
    subtitle: 'Mastering ==, !=, >, <, and boolean operators.',
    conceptTitle: 'The True and False Values of Code',
    explanation: [
      'In programming, comparisons result in one of two Boolean values: True or False.',
      'Remember that a single equal sign (=) assigns a value, whereas two equal signs (==) test whether two values are equal.'
    ],
    codeSnippet: `age = 18
is_adult = age >= 18
has_ticket = True

can_enter = is_adult and has_ticket
print(f"Can enter venue: {can_enter}")`,
    language: 'python',
    simulatedOutput: `Can enter venue: True`,
    lineBreakdown: [
      { lineNumber: 2, code: 'is_adult = age >= 18', explanation: 'Calculates comparison and stores True in boolean variable.' },
      { lineNumber: 5, code: 'can_enter = is_adult and has_ticket', explanation: 'Both sides must be True for "and" to return True.' },
    ],
    importantTip: {
      title: '= vs ==',
      description: 'The number one beginner syntax error is writing "if x = 5:" instead of "if x == 5:". Keep them clear!',
    },
    exerciseId: 'ex-python-while-1',
    quizId: 'quiz-python-loops',
    nextLessonId: 'python-13',
    prevLessonId: 'python-11',
  },
  'python-14': {
    id: 'python-14',
    courseId: 'python-beginners',
    courseTitle: 'Python for Beginners',
    order: 14,
    totalInCourse: 28,
    title: 'The For Loop & Range Function',
    subtitle: 'Iterate cleanly over sequences and ranges of numbers.',
    conceptTitle: 'Iterating over Ranges',
    explanation: [
      'While loops are great when you do not know how many iterations you need. But when you do know, for item in range(...) is cleaner.',
      'The range(start, stop) function generates numbers starting at start and stopping one before stop.'
    ],
    codeSnippet: `# Print numbers from 1 up to (not including) 6
for num in range(1, 6):
    print(f"Number: {num}")`,
    language: 'python',
    simulatedOutput: `Number: 1
Number: 2
Number: 3
Number: 4
Number: 5`,
    lineBreakdown: [
      { lineNumber: 2, code: 'for num in range(1, 6):', explanation: 'Automatically handles assignment and incrementing for each step.' },
      { lineNumber: 3, code: '    print(f"Number: {num}")', explanation: 'Runs 5 times with num taking values 1, 2, 3, 4, and 5.' },
    ],
    importantTip: {
      title: 'Range excludes the stop index',
      description: 'range(1, 6) stops at 5! If you want 6 included, use range(1, 7).',
    },
    exerciseId: 'ex-python-while-1',
    quizId: 'quiz-python-loops',
    nextLessonId: 'python-15',
    prevLessonId: 'python-13',
  },
};

export const EXERCISES: Exercise[] = [
  {
    id: 'ex-python-while-1',
    lessonId: 'python-13',
    courseId: 'python-beginners',
    title: 'Countdown with a While Loop',
    language: 'python',
    difficulty: 'Beginner',
    taskDescription: 'Write a while loop that starts at `seconds = 5` and counts down to `1`. In each iteration, print `"T-minus " + str(seconds)`. Once the loop finishes, print `"Blast off!"`.',
    requirements: [
      { id: 'req-1', text: 'Initialize seconds variable to 5' },
      { id: 'req-2', text: 'Construct a while loop that runs while seconds > 0' },
      { id: 'req-3', text: 'Print "T-minus {seconds}" during each cycle' },
      { id: 'req-4', text: 'Decrease seconds by 1 in each cycle (seconds -= 1)' },
      { id: 'req-5', text: 'Print "Blast off!" after the loop has concluded' },
    ],
    starterCode: `# 1. Set the initial countdown timer
seconds = 5

# 2. Write your while loop below
while seconds > 0:
    # TODO: Print current second and decrement
    pass

# 3. Print the final message
`,
    solutionCode: `seconds = 5

while seconds > 0:
    print(f"T-minus {seconds}")
    seconds -= 1

print("Blast off!")`,
    expectedOutput: `T-minus 5\nT-minus 4\nT-minus 3\nT-minus 2\nT-minus 1\nBlast off!`,
    hints: [
      'Hint 1 (Concept): Remember that a while loop needs a condition that tests the seconds variable, like `seconds > 0`.',
      'Hint 2 (Syntax): Inside the loop body, make sure to decrement: `seconds = seconds - 1` or `seconds -= 1`.',
      'Hint 3 (Indentation): Print "Blast off!" at the root indentation level (no spaces on the left), so it only executes when the loop finishes.',
    ],
    errorGuides: [
      {
        triggerPattern: 'pass',
        title: 'Unreplaced Starter Placeholder',
        explanation: 'You still have "pass" inside your loop. Replace it with your print and decrement statements.',
        hint: 'Remove "pass" and add `print(f"T-minus {seconds}")` followed by `seconds -= 1`.',
      },
      {
        triggerPattern: 'seconds += 1',
        title: 'Counter Increasing Instead of Decreasing',
        explanation: 'You wrote `seconds += 1`. This increases the count, which will create an infinite loop since seconds will always remain greater than 0.',
        hint: 'Change `+= 1` to `-= 1` to count down toward 0.',
      },
      {
        triggerPattern: 'missing_decrement',
        title: 'Missing Decrement Step',
        explanation: 'Your loop does not appear to change the `seconds` variable inside the block. This would cause an infinite loop.',
        hint: 'Add `seconds -= 1` as the last line inside the indented while block.',
      },
      {
        triggerPattern: 'missing_blastoff',
        title: 'Missing Final Message',
        explanation: 'The loop ran, but we did not detect `print("Blast off!")` after the loop.',
        hint: 'Add `print("Blast off!")` on a new line outside the while loop.',
      },
    ],
    xpReward: 50,
  },
  {
    id: 'ex-python-while-2',
    lessonId: 'python-13',
    courseId: 'python-beginners',
    title: 'Summing Even Numbers',
    language: 'python',
    difficulty: 'Beginner',
    taskDescription: 'Calculate the sum of all even numbers between 2 and 10 (inclusive: 2, 4, 6, 8, 10). Use a while loop to accumulate the total into a variable named `total_sum` and print it.',
    requirements: [
      { id: 'req-1', text: 'Initialize total_sum = 0 and current_num = 2' },
      { id: 'req-2', text: 'Loop while current_num <= 10' },
      { id: 'req-3', text: 'Add current_num to total_sum' },
      { id: 'req-4', text: 'Increment current_num by 2' },
      { id: 'req-5', text: 'Print the final total_sum (should equal 30)' },
    ],
    starterCode: `total_sum = 0
current_num = 2

# Write your loop here
while current_num <= 10:
    # Add to total_sum and increment current_num
    pass

print(f"Total: {total_sum}")`,
    solutionCode: `total_sum = 0
current_num = 2

while current_num <= 10:
    total_sum += current_num
    current_num += 2

print(f"Total: {total_sum}")`,
    expectedOutput: `Total: 30`,
    hints: [
      'Hint 1: To add to a total, use `total_sum += current_num`.',
      'Hint 2: Since we only want even numbers, increment `current_num += 2` each step.',
      'Hint 3: 2 + 4 + 6 + 8 + 10 = 30.',
    ],
    errorGuides: [
      {
        triggerPattern: 'current_num += 1',
        title: 'Step Size is 1 Instead of 2',
        explanation: 'Incrementing by 1 includes odd numbers. The exercise asks for even numbers.',
        hint: 'Use `current_num += 2` to jump from 2 to 4, 6, 8, and 10.',
      },
    ],
    xpReward: 50,
  },
  {
    id: 'ex-python-while-3',
    lessonId: 'python-11',
    courseId: 'python-beginners',
    title: 'Ticket Price Evaluator',
    language: 'python',
    difficulty: 'Beginner',
    taskDescription: 'Create a program that determines the ticket price based on age: under 12 costs $8, 12 to 64 costs $15, and 65 or older costs $10. Test with `age = 70`.',
    requirements: [
      { id: 'req-1', text: 'Set age = 70' },
      { id: 'req-2', text: 'Use if / elif / else to check age' },
      { id: 'req-3', text: 'Assign the price to a variable called price' },
      { id: 'req-4', text: 'Print f"Ticket price: ${price}"' },
    ],
    starterCode: `age = 70
price = 0

# Add your conditional logic here

print(f"Ticket price: \${price}")`,
    solutionCode: `age = 70
price = 0

if age < 12:
    price = 8
elif age >= 65:
    price = 10
else:
    price = 15

print(f"Ticket price: \${price}")`,
    expectedOutput: `Ticket price: $10`,
    hints: [
      'Hint 1: Start with `if age < 12:` to catch children first.',
      'Hint 2: Use `elif age >= 65:` to assign the senior discount ($10).',
      'Hint 3: Use `else:` for standard adults ($15).',
    ],
    errorGuides: [],
    xpReward: 50,
  },
];

export const QUIZZES: Record<string, Quiz> = {
  'quiz-python-loops': {
    id: 'quiz-python-loops',
    lessonId: 'python-13',
    courseId: 'python-beginners',
    title: 'Loops and Conditions Checkpoint',
    description: 'Test your understanding of while loops, iteration variables, and termination conditions.',
    questions: [
      {
        id: 'q-1',
        question: 'What is the exact output of this code snippet?',
        codeSnippet: `num = 1
while num < 4:
    print(num)
    num += 1`,
        options: [
          { id: 'opt-1', text: '1, 2, 3, 4', isCorrect: false, explanation: 'Incorrect. The condition is "num < 4", which is False when num reaches 4.' },
          { id: 'opt-2', text: '1, 2, 3', isCorrect: true, explanation: 'Correct! The loop prints 1, 2, and 3. When num becomes 4, the condition (4 < 4) evaluates to False and the loop stops.' },
          { id: 'opt-3', text: '0, 1, 2, 3', isCorrect: false, explanation: 'Incorrect. Notice num starts at 1, not 0.' },
          { id: 'opt-4', text: '1, 2', isCorrect: false, explanation: 'Incorrect. 3 is strictly less than 4, so 3 is printed too.' },
        ],
        xpReward: 15,
      },
      {
        id: 'q-2',
        question: 'What happens if the condition in a while loop never evaluates to False?',
        options: [
          { id: 'opt-1', text: 'Python automatically fixes it by stopping after 100 loops', isCorrect: false, explanation: 'Incorrect. Python will not guess your intentions; it will continue executing.' },
          { id: 'opt-2', text: 'It creates an infinite loop that runs forever until stopped', isCorrect: true, explanation: 'Spot on! Without a condition turning False or a break statement, the program remains locked in an infinite loop.' },
          { id: 'opt-3', text: 'The program throws a SyntaxError before running', isCorrect: false, explanation: 'Incorrect. Syntactically it is valid code; it is a logical runtime trap.' },
          { id: 'opt-4', text: 'The computer reboots immediately', isCorrect: false, explanation: 'Incorrect. Modern systems simply keep running the process until terminated.' },
        ],
        xpReward: 15,
      },
      {
        id: 'q-3',
        question: 'Which keyword can you place inside a loop to immediately exit it, regardless of the condition?',
        options: [
          { id: 'opt-1', text: 'exit()', isCorrect: false, explanation: 'Incorrect. exit() terminates the whole script, not just the enclosing loop.' },
          { id: 'opt-2', text: 'stop', isCorrect: false, explanation: 'Incorrect. "stop" is not a reserved Python keyword for loop control.' },
          { id: 'opt-3', text: 'break', isCorrect: true, explanation: 'Correct! The "break" keyword immediately stops the active loop and moves execution to the line directly after the loop.' },
          { id: 'opt-4', text: 'continue', isCorrect: false, explanation: 'Incorrect. "continue" skips the rest of the current iteration and jumps to the next iteration.' },
        ],
        xpReward: 15,
      },
      {
        id: 'q-4',
        question: 'Why does Python rely on indentation inside loop blocks?',
        options: [
          { id: 'opt-1', text: 'Indentation is purely cosmetic for readability and does not change execution', isCorrect: false, explanation: 'Incorrect. In Python, indentation defines block scope and program structure.' },
          { id: 'opt-2', text: 'To determine which lines of code belong inside the loop body', isCorrect: true, explanation: 'Exactly right! Python uses consistent 4-space indentation instead of curly braces {} to know which statements repeat.' },
          { id: 'opt-3', text: 'To tell the operating system how much RAM to allocate', isCorrect: false, explanation: 'Incorrect. Indentation has nothing to do with memory management.' },
          { id: 'opt-4', text: 'To speed up the CPU calculation cycles', isCorrect: false, explanation: 'Incorrect. Indentation is for lexical scope parsing.' },
        ],
        xpReward: 15,
      },
      {
        id: 'q-5',
        question: 'Consider this code. What will be printed after execution?',
        codeSnippet: `count = 5
while count > 0:
    count -= 2
print(count)`,
        options: [
          { id: 'opt-1', text: '1', isCorrect: false, explanation: 'Close! When count is 1, 1 > 0 is still True, so it executes one more time: 1 - 2 = -1.' },
          { id: 'opt-2', text: '-1', isCorrect: true, explanation: 'Outstanding! Trace: Start 5 -> 3 -> 1 -> -1. When count is -1, -1 > 0 is False, so the loop exits and prints -1.' },
          { id: 'opt-3', text: '0', isCorrect: false, explanation: 'Incorrect. 5 minus 2 is 3, minus 2 is 1, minus 2 is -1. It never lands on 0.' },
          { id: 'opt-4', text: '3', isCorrect: false, explanation: 'Incorrect. 3 is still > 0, so the loop does not stop at 3.' },
        ],
        xpReward: 15,
      },
    ],
  },
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-streak-7',
    title: '7-Day Streak Master',
    description: 'Maintained a consistent daily learning streak for 7 consecutive days.',
    icon: 'Flame',
    category: 'streak',
    progress: 7,
    maxProgress: 7,
    unlocked: true,
    xpBonus: 100,
    unlockedDate: 'Today',
  },
  {
    id: 'ach-first-run',
    title: 'First Code Run',
    description: 'Executed your very first live code practice exercise in the terminal.',
    icon: 'Play',
    category: 'practice',
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    xpBonus: 50,
    unlockedDate: '6 days ago',
  },
  {
    id: 'ach-quiz-ace',
    title: 'Quiz Ace',
    description: 'Achieved a perfect 100% score on any course milestone checkpoint quiz.',
    icon: 'Award',
    category: 'quiz',
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    xpBonus: 75,
    unlockedDate: '3 days ago',
  },
  {
    id: 'ach-syntax-explorer',
    title: 'Syntax Explorer',
    description: 'Complete 10 interactive lessons in any foundational curriculum.',
    icon: 'BookOpen',
    category: 'lessons',
    progress: 12,
    maxProgress: 10,
    unlocked: true,
    xpBonus: 150,
    unlockedDate: 'Yesterday',
  },
  {
    id: 'ach-bug-hunter',
    title: 'Bug Hunter',
    description: 'Fix 5 errors reported by Code Mentor and compiler diagnostics.',
    icon: 'Bug',
    category: 'practice',
    progress: 3,
    maxProgress: 5,
    unlocked: false,
    xpBonus: 100,
  },
  {
    id: 'ach-marathoner',
    title: 'Code Marathoner',
    description: 'Accumulate 2,000 total XP points across exercises and quizzes.',
    icon: 'Zap',
    category: 'mastery',
    progress: 1240,
    maxProgress: 2000,
    unlocked: false,
    xpBonus: 250,
  },
  {
    id: 'ach-arch-sentinel',
    title: 'Code Architect Sentinel',
    description: 'Diagnose fragile code, memory leaks, and anti-patterns in the Architecture Lab.',
    icon: 'ShieldCheck',
    category: 'mastery',
    progress: 1,
    maxProgress: 3,
    unlocked: false,
    xpBonus: 150,
  },
];

export const INITIAL_MENTOR_MESSAGES: MentorMessage[] = [
  {
    id: 'm-1',
    sender: 'mentor',
    text: "Hello Alex! 👋 I'm Code Mentor, your personal coding guide. Whenever you feel stuck on a loop, wonder why an error occurred, or need a gentle hint, just ask! How can I assist you with Loops and Conditions today?",
    timestamp: '10:00 AM',
    mode: 'hint',
  },
  {
    id: 'm-2',
    sender: 'user',
    text: 'Why does Python care so much about indentation?',
    timestamp: '10:02 AM',
  },
  {
    id: 'm-3',
    sender: 'mentor',
    text: "Great question! Most languages use curly brackets `{}` or keywords like `begin` / `end` to mark what's inside a loop or function. Python wanted code to look clean and readable, so it uses indentation (typically 4 spaces) directly as syntax.\n\nEverything pushed 4 spaces to the right belongs inside that loop block. When you slide back to the left margin, Python knows you've finished the loop!",
    codeSnippet: `# Inside the loop:
while count < 3:
    print("I repeat!")  # Indented

# Outside the loop:
print("I run once!")    # Left aligned`,
    timestamp: '10:03 AM',
    mode: 'explanation',
  },
  {
    id: 'm-4',
    sender: 'user',
    text: 'What is the difference between = and == again?',
    timestamp: '10:05 AM',
  },
  {
    id: 'm-5',
    sender: 'mentor',
    text: "Think of a single `=` as **action / assignment**: it puts something into a box. For instance: `score = 10` puts the number 10 into the variable `score`.\n\nTwo `==` is a **question / comparison**: it checks whether two items match without modifying either. `score == 10` asks: *'Does score equal 10 right now?'* and responds with True or False!",
    timestamp: '10:06 AM',
    mode: 'hint',
  },
];

export const WEEKLY_ACTIVITY: DailyActivity[] = [
  { day: 'Monday', shortDay: 'Mon', dateStr: 'Sep 16', minutes: 22, xp: 140, completedGoal: true, isToday: false },
  { day: 'Tuesday', shortDay: 'Tue', dateStr: 'Sep 17', minutes: 18, xp: 110, completedGoal: true, isToday: false },
  { day: 'Wednesday', shortDay: 'Wed', dateStr: 'Sep 18', minutes: 35, xp: 220, completedGoal: true, isToday: false },
  { day: 'Thursday', shortDay: 'Thu', dateStr: 'Sep 19', minutes: 25, xp: 160, completedGoal: true, isToday: false },
  { day: 'Friday', shortDay: 'Fri', dateStr: 'Sep 20', minutes: 15, xp: 100, completedGoal: true, isToday: false },
  { day: 'Saturday', shortDay: 'Sat', dateStr: 'Sep 21', minutes: 40, xp: 260, completedGoal: true, isToday: false },
  { day: 'Sunday', shortDay: 'Sun', dateStr: 'Sep 22', minutes: 30, xp: 250, completedGoal: true, isToday: true },
];

export const TOPIC_PROFICIENCY: TopicProficiency[] = [
  { name: 'Variable Assignment & Naming', proficiency: 96, status: 'strong', lessonCount: 4 },
  { name: 'Print Formatting & F-Strings', proficiency: 92, status: 'strong', lessonCount: 3 },
  { name: 'Basic Arithmetic Operators', proficiency: 90, status: 'strong', lessonCount: 3 },
  { name: 'String Slicing & Indexing', proficiency: 84, status: 'strong', lessonCount: 2 },
  { name: 'Nested If/Elif Statements', proficiency: 64, status: 'needs_practice', lessonCount: 3 },
  { name: 'While Loop Exit Conditions', proficiency: 58, status: 'needs_practice', lessonCount: 2 },
];

export const DAILY_CHALLENGE = {
  id: 'daily-2026-09-22',
  title: 'Odd or Even Sieve',
  description: 'Write a concise expression to test if a given number `n = 42` is even or odd using the modulo `%` operator.',
  xpReward: 50,
  language: 'python',
  difficulty: 'Quick (3 min)',
  timeRemaining: '14 hrs 18 mins',
};
