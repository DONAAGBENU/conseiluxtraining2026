// app/centre-de-langues/test-de-niveau/page.tsx
// Test de Niveau Anglais Officiel Conseilux (Tracktest B1 + TOEFL Style Writing & Speaking)

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguageCenter } from "../../components/LanguageCenterProvider";
import { isBlockedExamShortcut, isBlockedClipboardAction } from "../../../lib/examSecurity";
import { 
  User, Mail, Phone, MapPin, Building, GraduationCap, Clock, 
  CheckCircle, Download, Mic, Award, AlertTriangle, FileText, 
  Volume2, PenTool, Sparkles 
} from "lucide-react";

interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  company: string;
  educationLevel: string;
}

interface TestAnswers {
  grammar: { [key: string]: string };
  reading: { [key: string]: string };
  listening: { [key: string]: string };
  writing: { [key: string]: string };
  speaking: { [key: string]: string };
}

interface TestResult {
  grammarScore: number;
  readingScore: number;
  listeningScore: number;
  totalCoreScore: number;
  percentage: number;
  passed: boolean;
  writingScore: number;
  speakingScore: number;
  level: string;
}

interface SpeakingTask {
  id: string;
  type: string;
  title: string;
  prepTime: number;
  speakTime: number;
  assistantImage: string;
  assistantName: string;
  assistantRole: string;
  prompt: string;
  passage?: string;
  audioFile?: string;
}

export default function TestDeNiveauPage() {
  const { darkMode, t, language } = useLanguageCenter();
  const tl = t.testLevelPage;

  // Navigation Steps
  const [currentStep, setCurrentStep] = useState<'form' | 'grammar' | 'reading' | 'listening' | 'writing' | 'speaking' | 'results'>('form');

  // Candidate Data Form
  const [studentData, setStudentData] = useState<StudentFormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    company: '',
    educationLevel: 'Licence / Bachelor (Bac+3)',
  });

  // Test Answers State
  const [testAnswers, setTestAnswers] = useState<TestAnswers>({
    grammar: {},
    reading: {},
    listening: {},
    writing: {},
    speaking: {},
  });

  // Test Result State
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [examNotice, setExamNotice] = useState<string | null>(null);

  // Writing Task State & Timers
  const [writingTaskIndex, setWritingTaskIndex] = useState(0);
  const [writingTimeLeft, setWritingTimeLeft] = useState(15 * 60); // 15 mins
  const [writingTimerActive, setWritingTimerActive] = useState(false);

  // Speaking Task State & Timers
  const [speakingTaskIndex, setSpeakingTaskIndex] = useState(0);
  const [prepTimeLeft, setPrepTimeLeft] = useState(15);
  const [isPreparing, setIsPreparing] = useState(false);
  const [speakTimeLeft, setSpeakTimeLeft] = useState(45);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // Dark mode helpers
  const bgMain = darkMode ? "bg-[#050d1f] text-white" : "bg-white text-[#0a1128]";
  const textMuted = darkMode ? "text-white/60" : "text-slate-600";
  const cardBg = darkMode ? "bg-[#111c35] border-[#ff6b00]/40" : "bg-white border-[#ff6b00]";
  const inputBg = darkMode ? "bg-[#111c35] border-white/10" : "bg-white border-slate-200";

  const stopTaskSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const protectExamSession = useCallback((event: Event | KeyboardEvent) => {
    if (event instanceof KeyboardEvent && isBlockedExamShortcut(event)) {
      event.preventDefault();
      setExamNotice('Attention : les raccourcis navigateur et les tentatives de triche sont désactivés pendant le test.');
      return true;
    }

    if (event instanceof Event && isBlockedClipboardAction(event)) {
      event.preventDefault();
      setExamNotice('Copie, collage et navigation hors du test sont désactivés pour sécuriser l’examen.');
      return true;
    }

    return false;
  }, []);

  useEffect(() => {
    if (currentStep === 'form' || currentStep === 'results') {
      setExamNotice(null);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => protectExamSession(event);
    const handleClipboard = (event: Event) => protectExamSession(event);
    const handleContextMenu = (event: Event) => {
      event.preventDefault();
      setExamNotice('Le menu contextuel est désactivé pendant le test.');
    };
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
      setExamNotice('Votre session de test est protégée. Merci de rester sur cette page.');
    };
    const handleVisibility = () => {
      if (document.hidden) {
        setExamNotice('La tentative de sortie de la page a été bloquée. Continuez le test sur cette fenêtre.');
      }
    };
    const handleBlur = () => {
      setExamNotice('Merci de rester dans la fenêtre du test. Une tentative de changement de contexte a été détectée.');
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleClipboard);
    document.addEventListener('cut', handleClipboard);
    document.addEventListener('paste', handleClipboard);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleContextMenu);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleClipboard);
      document.removeEventListener('cut', handleClipboard);
      document.removeEventListener('paste', handleClipboard);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleContextMenu);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
    };
  }, [currentStep, protectExamSession]);

  const speakTask = useCallback((task: SpeakingTask) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const textToRead = [task.title, task.passage, task.prompt].filter(Boolean).join(". ");
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = synth.getVoices();
    const preferredVoice = voices.find((voice) => /en/i.test(voice.lang) && /female|samantha|zira|aria|jenny|victoria|google/i.test(voice.name))
      ?? voices.find((voice) => /en/i.test(voice.lang))
      ?? voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    synth.speak(utterance);
  }, []);

  useEffect(() => {
    return () => stopTaskSpeech();
  }, [stopTaskSpeech]);

  // ---------------------------------------------------------------------------
  // SECTION I: Grammar (20 Questions - Tracktest B1)
  // ---------------------------------------------------------------------------
  const grammarQuestions = [
    { id: 'g1', question: 'This castle ................ by our king George II.', options: ['built', 'was built', 'was building'], correct: 'b' },
    { id: 'g2', question: 'I can paint ....., but I want to be better than my sister.', options: ['nice', 'good', 'well'], correct: 'c' },
    { id: 'g3', question: 'The kid was ..................... fast that no one saw him.', options: ['so', 'too', 'such'], correct: 'a' },
    { id: 'g4', question: '............. adults know how to use the Internet.', options: ['Little', 'Few', 'Much'], correct: 'b' },
    { id: 'g5', question: '.......... to the Martin’s party next Friday.', options: ['Do you come', 'Are you coming', 'Did you come'], correct: 'b' },
    { id: 'g6', question: 'Could you please turn ................... the volume? I’d like to listen to the news.', options: ['up', 'out', 'on'], correct: 'a' },
    { id: 'g7', question: 'Can I have ….. sugar, please.', options: ['a', 'any', 'some'], correct: 'c' },
    { id: 'g8', question: 'I ..... TV, when suddenly something crashed into our house.', options: ['watched', 'am watching', 'was watching'], correct: 'c' },
    { id: 'g9', question: 'Jeudith ......................... to the club every day, but now she doesn’t.', options: ['was going', 'used to go', 'didn’t use to go'], correct: 'b' },
    { id: 'g10', question: 'He hasn’t seen Gill ..... he left school.', options: ['just', 'since', 'for'], correct: 'b' },
    { id: 'g11', question: 'Susan …...... eat meat, but now she does.', options: ['didn’t use to', 'used to', 'doesn’t'], correct: 'a' },
    { id: 'g12', question: '“This is a nice bathroom.” “Yes. It’s the one ....... we’ve just redecorated.”', options: ['when', 'who', 'which'], correct: 'c' },
    { id: 'g13', question: '“Did you know that John is getting married?” “Yes. He .... me yesterday.”', options: ['told', 'said', 'spoke'], correct: 'a' },
    { id: 'g14', question: 'Judy ................. type since she went to college.', options: ['can’t', 'has been able to', 'can'], correct: 'b' },
    { id: 'g15', question: 'I’m thirsty. I .......... for fifty minutes.', options: ['am running', 'have run', 'have been running'], correct: 'c' },
    { id: 'g16', question: 'When I am older, I ....... live by myself.', options: ['will be able to', 'can’t', 'have been able to'], correct: 'a' },
    { id: 'g17', question: 'I’m going to the doctor ......tomorrow morning.', options: ['on', '-', 'at'], correct: 'b' },
    { id: 'g18', question: 'Thea .................. my best friend since 2008.', options: ['was', 'is being', 'has been'], correct: 'c' },
    { id: 'g19', question: '“I didn’t enjoy that film last night.” “Neither did I. It was .... boring that I almost fell asleep.”', options: ['such', 'so', 'such a'], correct: 'b' },
    { id: 'g20', question: '........... I take your order, please?', options: ['Mustn’t', 'Must', 'May'], correct: 'c' }
  ];

  // ---------------------------------------------------------------------------
  // SECTION II: Reading Comprehension (5 Tasks, 25 Questions)
  // ---------------------------------------------------------------------------
  const readingTasks = [
    {
      id: 'rt1',
      title: 'Task 1: YUKON ADVENTURE HOLIDAYS',
      passage: `Looking for the perfect place for a holiday? Then come to the Yukon, in north-western Canada, where we have package holidays to please everyone.
From October to March you can choose one of our „winter wonderland“ holidays. These include skiing, snowmobiling and dogsledding. From March to August we have organised hiking or mountain climbing activities, as well as canoeing or white water rafting down some of the most beautiful rivers in the Yukon Valley. All of our adventure package holidays include guides and instructors to help you enjoy activities you have never tried before. Accommodation ranges from four-star hotels to log cabins or camping grounds.
For more information check out our website: wwww.yukonholidays.com or call us toll free at 1-800-YUKON.`,
      questions: [
        { id: 'r1', question: 'Package holidays are available all year round.', options: ['True', 'False'], correct: 'b' },
        { id: 'r2', question: 'You can travel by dogsled in July.', options: ['True', 'False'], correct: 'b' },
        { id: 'r3', question: 'You can do watersports in the Yukon.', options: ['True', 'False'], correct: 'a' },
        { id: 'r4', question: 'You can only stay at campsites.', options: ['True', 'False'], correct: 'b' },
        { id: 'r5', question: 'Phone calls to the company are free of charge.', options: ['True', 'False'], correct: 'a' }
      ]
    },
    {
      id: 'rt2',
      title: 'Task 2: TRAVEL GUIDE: SOUTH AFRICA',
      passage: `South Africa is one of the most beautiful countries in the world and a favourite destination for many travellers. From Kruger National Park to the Kalahari Desert, South Africa provides a great introduction to Africa, but it has more to offer than stunning landscapes.
If you visit South Africa, make sure you stop off in Cape Town. There is so much to see and do, you'll never get bored. There's always something happening in this exciting city, and it has great shops, too. The more adventurous can take a trip up Table Mountain or take a boat trip to see great white sharks and seals. Cape Town has something for everybody.
South Africa is a place that everyone should visit at least once in their lifetime! Book now for a holiday you will never forget.`,
      questions: [
        { id: 'r6', question: 'South Africa is not evry popular with tourists.', options: ['True', 'False'], correct: 'b' },
        { id: 'r7', question: 'The Kalahari Desert is in Cape Town.', options: ['True', 'False'], correct: 'b' },
        { id: 'r8', question: 'There is not much going on in Cape Town.', options: ['True', 'False'], correct: 'b' },
        { id: 'r9', question: 'You can see some big, scary fish there.', options: ['True', 'False'], correct: 'a' },
        { id: 'r10', question: 'The author recommends that everyone should go to South Africa.', options: ['True', 'False'], correct: 'a' }
      ]
    },
    {
      id: 'rt3',
      title: 'Task 3: SCANDAL IN BOHEMIA',
      passage: `A slow and heavy step, which had been heard upon the stairs and in the corridor, paused immediately outside the door. Then there was a loud knock on the door.
"Come in!" said Holmes.
A very tall man entered, with the chest and limbs of a Hercules. His dress was rich with a richness which would, in England, be considered bad taste. He was wearing a double-breasted coat with fur-trimmed collar and cuffs, over which he wore a deep blue cloak lined with flame-coloured silk. His boots, which went halfway up his legs, were also trimmed with fur, completing his appearance of barbaric richness. He had a thick moustache and a straight chin suggesting strong determination, but a black mask hid the upper part of his face. He was carrying a hat in one hand, while his other hand was raised, as if he had just finished straightening his mask.
"Please take a seat," said Holmes. "This is my friend and colleague, Dr Watson. Whom have I the honour to address?"
"You may address me as Count von Kramm, a Bohemian aristocrat. I hope your friend is a man I can trust. If not, I prefer to speak to you alone," said our strange visitor.
"You can say anything in front of this man that you can say to me," Holmes replied. The Count nodded and continued. "You will excuse the mask; my employer wishes my true identity to remain a secret."
"If your majesty would like to tell us your problem," Holmes remarked, "I will be happy to advise you."
The Count sprang from his chair, paced nervously up and down the room, then took off the mask and threw it on the floor.
"You are right!" he cried. "I am the King. Why should I try to hide it?"
"Why, indeed?" said Holmes. "I knew, even before you spoke, that you were the Grand Duke of CasselFelstein and the King of Bohemia."`,
      questions: [
        { id: 'r11', question: "The visitor's mouth and chin are hidden by a mask.", options: ['True', 'False'], correct: 'b' },
        { id: 'r12', question: 'The visitor says he is Count von Kramm.', options: ['True', 'False'], correct: 'a' },
        { id: 'r13', question: 'The visitor is unsure whether to trust Watson.', options: ['True', 'False'], correct: 'a' },
        { id: 'r14', question: 'Holmes does not know why the visitor has come.', options: ['True', 'False'], correct: 'a' },
        { id: 'r15', question: 'Holmes realises the visitor is the King when he takes off the mask.', options: ['True', 'False'], correct: 'b' }
      ]
    },
    {
      id: 'rt4',
      title: 'Task 4: FACE YOUR FEARS DAY',
      passage: `What are you afraid of? Snakes, heights, the dark?
Whatever it is, it's time to face your fears! Face Your Fears Day is on the third Tuesday in October, and it is the day when people stand up to the things that scare them and say “You don't scare me anymore!”
The day was started by a blogger called Steve Hughes in 2007 to help people become a little braver.
On Face Your Fears Day, people do brave things. Last year, The Grove School in England met 'scary' animals like snakes and spiders, and even had a climbing wall setup in the playground for students who wanted to face their fear of heights. Many charities visit schools and colleges to do presentations about how to beat social fears, like public speaking or hanging out with people they don't know. Also, over the last few years, bloggers have posted videos of themselves facing their fears in order to encourage others to do the same.
Facing your fears can be difficult. If you are afraid of something, you should try slowly facing it. For example, if you are afraid of snakes, start by looking at pictures and videos of them. Do some research and learn everything you can about them, because a lot of the time it is the fear of the unknown that is the biggest fear of all. When you feel you are ready, maybe take a trip to the zoo to watch them behind the glass. After a while you'll feel comfortable and confident enough to hold them. It’ll take time, but don't worry or rush, all fears are beatable!
Our fears can hold us back in life, but we shouldn't let them. Face Your Fears Day gives people the boost they need to defeat the things that scare them. This day is actually more about courage than fear. Will you be brave enough to face your fears this year?`,
      questions: [
        { id: 'r16', question: 'The first Face Your Fears Day was in 2007.', options: ['True', 'False', "Doesn't say"], correct: 'a' },
        { id: 'r17', question: 'On that day, people avoid the things that scare them.', options: ['True', 'False', "Doesn't say"], correct: 'b' },
        { id: 'r18', question: 'Some people are afraid of going to parties.', options: ['True', 'False', "Doesn't say"], correct: 'c' },
        { id: 'r19', question: 'It’s easier to beat a phobia if you do it quickly.', options: ['True', 'False', "Doesn't say"], correct: 'b' },
        { id: 'r20', question: 'Face Your Fears Day focuses more on people being brave than being scared.', options: ['True', 'False', "Doesn't say"], correct: 'a' }
      ]
    },
    {
      id: 'rt5',
      title: "Task 5: ALEXA'S BLOG",
      passage: `Hi everyone! Thanks for all your thoughts on my previous blog post. I loved reading all your comments.
I’ve got some great news! My friend, Alice, and I have just booked our summer holiday.
We’re going to Mexico to take part in a coastal conservation volunteer programme. We’re leaving on the 1st August and we’re going to stay there for three weeks! I think it’ll be an unforgettable experience. We arrive at Guadalajara International Airport early in the morning and then we are going to leave for the town of Guyutlán by bus. It’s about a four-hour drive from the airport. However, I don’t mind as we’ll be able to look at the view on our way there.
During the programme, we are going to help with the conservation of the sea turtles and crocodiles. We’re going to help protect the turtle nests and study the behaviour of other wildlife. But that’s not all! We’re also going to have two hours of Spanish lessons every day. It’s going to be hard work! At the weekends, we don’t have to work and can enjoy ourselves at the beach. I can’t wait! I will tell you all about it when I get home since there isn’t any Wi-Fi there and I’m not going to take my smartphone or tablet with me. What are your plans for this summer? Let me know in the comments below.`,
      questions: [
        { id: 'r21', question: 'The main purpose of the blog post is', options: ['to ask people to volunteer abroad', 'to advertise a holiday destination in Mexico', 'to inform people of future plans'], correct: 'c' },
        { id: 'r22', question: 'Alexa will spend her summer holidays', options: ['volunteering abroad.', 'studying the behaviour of sea turtles.', 'travelling around Mexico.'], correct: 'a' },
        { id: 'r23', question: 'What is NOT true about the volunteer programme?', options: ['It involves learning a skill.', 'It involves working seven days a week.', 'It involves working with various types of animals.'], correct: 'b' },
        { id: 'r24', question: 'Alexa thinks it will be difficult to', options: ['not have any free time.', 'learn Spanish.', 'work and study at the same time.'], correct: 'c' },
        { id: 'r25', question: 'During the trip, Alexa', options: ['will use her tablet to access the Internet.', 'won’t be updating her blog.', 'will tell her friends about her experience.'], correct: 'b' }
      ]
    }
  ];

  // ---------------------------------------------------------------------------
  // SECTION III: Listening Comprehension (5 Tasks, 25 Questions)
  // ---------------------------------------------------------------------------
  const listeningTasks = [
    {
      id: 'lt1',
      title: 'Listening Task 1: Radio Interview of a Restaurant',
      audioFile: '/tests-de-niveau/audio/listening-01.mpeg',
      instruction: 'You will hear a radio interview of a restaurant. For each question choose the right answer A, B or C.',
      questions: [
        { id: 'l1', question: '1. The Italian restaurant has ……', options: ['moved to the centre of the city.', 'only just opened.', 'changed its décor.'], correct: 'c' },
        { id: 'l2', question: '2. The restaurant is different from others because ……', options: ['it is spacious', 'the atmosphere is very formal', 'it has an unusual name.'], correct: 'a' },
        { id: 'l3', question: '3. All the food at Angelo’s ……', options: ['tastes good.', 'is served with pasta.', 'looks beautiful.'], correct: 'a' },
        { id: 'l4', question: '4. What does the presenter say about the starters?', options: ['There is a wide variety', 'They are all very light.', 'You can choose between hot or cold soup'], correct: 'a' },
        { id: 'l5', question: '5. What does the presenter say about the desserts?', options: ['They are all homemade.', 'They are all delicious.', 'They aren’t as good as the coffee.'], correct: 'b' }
      ]
    },
    {
      id: 'lt2',
      title: 'Listening Task 2: Harrods Shop in London',
      audioFile: '/tests-de-niveau/audio/listening-02.mpeg',
      instruction: 'Listen and mark the correct item.',
      questions: [
        { id: 'l6', question: '1. Harrods is a shop in …...', options: ['Kensington.', 'Knightsbridge'], correct: 'b' },
        { id: 'l7', question: '2. The Chairman of Harrods is ……', options: ['Charles Henry Harrods', 'Mohamed Al Fayed'], correct: 'b' },
        { id: 'l8', question: '3. Harrods has survived ……', options: ['3 wars', 'a fire and two bombings'], correct: 'b' },
        { id: 'l9', question: '4. Harrods employs over ……. staff.', options: ['4000', '6000'], correct: 'a' },
        { id: 'l10', question: '5. ……. are the heart and soul of Harrods.', options: ['The Toy departments.', 'The Food Halls.'], correct: 'b' }
      ]
    },
    {
      id: 'lt3',
      title: 'Listening Task 3: Dogs as House Pets',
      audioFile: '/tests-de-niveau/audio/listening-03.mpeg',
      instruction: 'Listen and mark the statements True or False.',
      questions: [
        { id: 'l11', question: '1. Dogs make bad house pets', options: ['True', 'False'], correct: 'b' },
        { id: 'l12', question: '2. They never show their happiness', options: ['True', 'False'], correct: 'b' },
        { id: 'l13', question: '3. They are difficult to train as watchdogs', options: ['True', 'False'], correct: 'b' },
        { id: 'l14', question: '4. Dogs do not need any attention', options: ['True', 'False'], correct: 'b' },
        { id: 'l15', question: '5. Having a dog is tiring', options: ['True', 'False'], correct: 'a' }
      ]
    },
    {
      id: 'lt4',
      title: 'Listening Task 4: The Wieliczka Salt Mine',
      audioFile: '/tests-de-niveau/audio/listening-04.mpeg',
      instruction: 'Listen and mark True or False.',
      questions: [
        { id: 'l16', question: '1. Near Cracow, in northern Poland, is The Wieliczka Salt Mine', options: ['True', 'False'], correct: 'b' },
        { id: 'l17', question: '2. A king called The Blessed Kinga threw her ring into a salt mine', options: ['True', 'False'], correct: 'b' },
        { id: 'l18', question: '3. The salt used to be dug by hand', options: ['True', 'False'], correct: 'a' },
        { id: 'l19', question: '4. A chapel was destroyed by fire in 1769', options: ['True', 'False'], correct: 'b' },
        { id: 'l20', question: '5. A special attraction is the Chapel of The Blessed Kinga', options: ['True', 'False'], correct: 'a' }
      ]
    },
    {
      id: 'lt5',
      title: 'Listening Task 5: Reactions to Books (5 Speakers)',
      audioFile: '/tests-de-niveau/audio/listening-05.mpeg',
      instruction: 'Listen to five people talking and match them to their reactions to books.',
      questions: [
        { id: 'l21', question: '1. Speaker 1:', options: ['a) bored', 'b) excited', 'c) moved', 'd) confused', 'e) furious'], correct: 'd' },
        { id: 'l22', question: '2. Speaker 2:', options: ['a) bored', 'b) excited', 'c) moved', 'd) confused', 'e) furious'], correct: 'c' },
        { id: 'l23', question: '3. Speaker 3:', options: ['a) bored', 'b) excited', 'c) moved', 'd) confused', 'e) furious'], correct: 'a' },
        { id: 'l24', question: '4. Speaker 4:', options: ['a) bored', 'b) excited', 'c) moved', 'd) confused', 'e) furious'], correct: 'e' },
        { id: 'l25', question: '5. Speaker 5:', options: ['a) bored', 'b) excited', 'c) moved', 'd) confused', 'e) furious'], correct: 'b' }
      ]
    }
  ];

  // ---------------------------------------------------------------------------
  // SECTION IV: Writing (TOEFL iBT 2024 Format - 3 Tasks)
  // ---------------------------------------------------------------------------
  const writingTasks = [
    {
      id: 'w1',
      title: 'Task 1: Build a Sentence (Grammar & Structure)',
      duration: 5 * 60,
      minWords: 1,
      targetWords: '1 Complete Sentence',
      prompt: `Rearrange the following words to form a grammatically correct and meaningful sentence:

Words: efficient / communication / for / global / business / English / essential / is / proper

Task: Write the complete sentence using all the provided words in the correct order. You may add necessary punctuation but cannot add or remove words.`,
    },
    {
      id: 'w2',
      title: 'Task 2: Write an Email (Academic/Social Situation)',
      duration: 7 * 60,
      minWords: 100,
      targetWords: '100 - 150 words',
      prompt: `Situation: You are a university student who missed an important lecture last week due to illness. You need to email your professor, Dr. Martinez, to request the lecture notes and ask about the upcoming assignment.

Task: Write a formal email to Dr. Martinez that:
- Explains why you missed the lecture
- Politely requests the lecture notes and any handouts
- Asks about the assignment deadline and whether you can get an extension
- Expresses your commitment to catching up on the material
- Uses appropriate academic email etiquette`,
    },
    {
      id: 'w3',
      title: 'Task 3: Write for an Academic Discussion (TOEFL iBT Standard)',
      duration: 10 * 60,
      minWords: 100,
      targetWords: '100 - 150 words',
      prompt: `Online Class Discussion Board:
Professor Dr. Sarah Vance: "This week we are discussing the impact of remote work on employee productivity and work-life balance. Some studies suggest that remote work increases productivity due to fewer distractions, while others argue it leads to burnout and decreased work-life separation. What is your perspective based on your experience or observations?"

Classmate 1 (Elena): "I believe remote work has significantly improved my productivity. I can focus better without office interruptions, and the flexibility allows me to work during my most productive hours."

Classmate 2 (Marcus): "I disagree. Working from home has blurred the boundaries between work and personal life for me. I find myself working longer hours and feeling more stressed than when I had a clear separation between office and home."

Task: Respond to the professor's question. Express and support your opinion about remote work's impact on productivity and work-life balance. Clearly explain why you agree or disagree with your classmates' points, and add your own unique perspective or experience to the discussion.`,
    }
  ];

  // ---------------------------------------------------------------------------
  // SECTION V: Speaking (TOEFL iBT Format - 4 Tasks ~20 minutes)
  // ---------------------------------------------------------------------------
  const speakingTasks = useMemo<SpeakingTask[]>(() => [
    {
      id: 's1',
      type: 'Independent Speaking',
      title: 'Task 1: Independent Speaking (Personal Preference)',
      prepTime: 15,
      speakTime: 45,
      assistantImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&fit=crop&q=80',
      assistantName: 'Dr. Michael Chen',
      assistantRole: 'TOEFL Examiner',
      prompt: `Question: "Some people prefer to learn new skills by reading books and articles, while others prefer to learn through hands-on practice and experience. Which method do you think is more effective for learning English and why?"
      
Directions: State your preference clearly. Support your answer with specific reasons and examples from your own language learning experience.`,
    },
    {
      id: 's2',
      type: 'Integrated Speaking (Campus Situation)',
      title: 'Task 2: Campus Announcement - New Library Policy',
      prepTime: 30,
      speakTime: 60,
      assistantImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&fit=crop&q=80',
      assistantName: 'Professor Sarah Williams',
      assistantRole: 'Academic Advisor',
      passage: `University Library Announcement:

The university library has announced new operating hours starting next semester. The library will now be open 24 hours on weekdays (Monday through Friday) instead of closing at 10 PM. Additionally, quiet study zones will be expanded, and group study rooms can now be reserved online up to 2 weeks in advance. The administration believes these changes will better support students' diverse study schedules and improve academic performance.`,
      prompt: `Directions: Read the announcement about the new library policy. Then explain the main changes being implemented and discuss how these changes might benefit students' academic success.`,
    },
    {
      id: 's3',
      type: 'Integrated Speaking (Academic Lecture)',
      title: 'Task 3: Academic Lecture - Cognitive Psychology',
      prepTime: 30,
      speakTime: 60,
      assistantImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&fit=crop&q=80',
      assistantName: 'Dr. Emily Rodriguez',
      assistantRole: 'Psychology Professor',
      passage: `Lecture Summary: TheSpacing Effect in Learning

Research in cognitive psychology has demonstrated that distributed practice (spacing out learning sessions over time) leads to better long-term retention than massed practice (cramming). This phenomenon, known as the spacing effect, occurs because spaced learning allows for stronger memory consolidation and more effective neural connections. Studies show that students who review material at increasing intervals perform significantly better on delayed tests than those who study intensively in single sessions.`,
      prompt: `Directions: Using the information from the lecture, explain the spacing effect in learning and discuss why distributed practice is more effective than massed practice for long-term memory retention.`,
    },
    {
      id: 's4',
      type: 'Integrated Speaking (Listen & Describe)',
      title: 'Task 4: Object Description - Visual Analysis',
      prepTime: 20,
      speakTime: 60,
      assistantImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&fit=crop&q=80',
      assistantName: 'Dr. James Miller',
      assistantRole: 'Communication Skills Expert',
      passage: `Visual Description Exercise:

Imagine you are describing a modern office workspace to someone who has never seen one. Key elements to describe include:
- Ergonomic desk chair with adjustable height
- Dual monitor setup on the desk
- Mechanical keyboard and wireless mouse
- Standing desk option with electric motor
- Task lighting with adjustable brightness
- Cable management system
- Personal decorations (plants, photos)`,
      prompt: `Directions: Describe this modern office workspace in detail, focusing on the key elements listed. Use descriptive vocabulary and organize your description logically from general to specific details.`,
    }
  ], []);

  // ---------------------------------------------------------------------------
  // TIMERS & EFFECTS
  // ---------------------------------------------------------------------------
  // Writing timer
  useEffect(() => {
    if (!writingTimerActive) return;

    const interval = setInterval(() => {
      setWritingTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setWritingTimerActive(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [writingTimerActive]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }, [mediaRecorder]);

  // Speaking preparation timer
  useEffect(() => {
    if (!isPreparing) return;

    const interval = setInterval(() => {
      setPrepTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsPreparing(false);
          setIsRecording(true);
          setSpeakTimeLeft(speakingTasks[speakingTaskIndex].speakTime);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPreparing, speakingTaskIndex, speakingTasks]);

  // Speaking recording timer
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setSpeakTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          stopRecording();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording, stopRecording]);

  // ---------------------------------------------------------------------------
  // HANDLERS & HELPERS
  // ---------------------------------------------------------------------------
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!studentData.name.trim()) newErrors.name = language === 'fr' ? 'Le nom est requis' : 'Name is required';
    if (!studentData.email.trim()) {
      newErrors.email = language === 'fr' ? "L'email est requis" : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email)) {
      newErrors.email = language === 'fr' ? 'Email invalide' : 'Invalid email';
    }
    if (!studentData.phone.trim()) newErrors.phone = language === 'fr' ? 'Le téléphone est requis' : 'Phone is required';
    if (!studentData.country.trim()) newErrors.country = language === 'fr' ? 'Le pays est requis' : 'Country is required';
    if (!studentData.city.trim()) newErrors.city = language === 'fr' ? 'La ville est requise' : 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setCurrentStep('grammar');
    }
  };

  const handleAnswerChange = (section: keyof TestAnswers, questionId: string, value: string) => {
    setTestAnswers(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [questionId]: value
      }
    }));
  };

  // Calculate Scores
  const calculateScores = (): TestResult => {
    let grammarScore = 0;
    grammarQuestions.forEach(q => {
      if (testAnswers.grammar[q.id] === q.correct) grammarScore++;
    });

    let readingScore = 0;
    readingTasks.forEach(task => {
      task.questions.forEach(q => {
        if (testAnswers.reading[q.id] === q.correct) readingScore++;
      });
    });

    let listeningScore = 0;
    listeningTasks.forEach(task => {
      task.questions.forEach(q => {
        if (testAnswers.listening[q.id] === q.correct) listeningScore++;
      });
    });

    const totalCoreScore = grammarScore + readingScore + listeningScore;
    const percentage = Math.round((totalCoreScore / 70) * 100);
    const passed = percentage >= 65;

    // Evaluated Writing Score (/15)
    let writingScore = 0;
    writingTasks.forEach(t => {
      const text = testAnswers.writing[t.id] || '';
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      if (words >= t.minWords) writingScore += 5;
      else if (words >= Math.round(t.minWords / 2)) writingScore += 3;
      else if (words > 0) writingScore += 1;
    });

    // Evaluated Speaking Score (/20 for 4 tasks)
    let speakingScore = 0;
    speakingTasks.forEach(t => {
      const text = testAnswers.speaking[t.id] || '';
      const audio = testAnswers.speaking[`${t.id}_audio`] || '';
      // Base score for written notes
      if (text.trim().length > 30) speakingScore += 3;
      else if (text.trim().length > 10) speakingScore += 2;
      else if (text.trim().length > 0) speakingScore += 1;
      // Bonus for audio recording
      if (audio) speakingScore += 2;
    });

    let level = 'A1';
    if (percentage >= 90) level = 'C1';
    else if (percentage >= 80) level = 'B2';
    else if (percentage >= 65) level = 'B1';
    else if (percentage >= 40) level = 'A2';

    return {
      grammarScore,
      readingScore,
      listeningScore,
      totalCoreScore,
      percentage,
      passed,
      writingScore,
      speakingScore,
      level
    };
  };

  const moveToNextSection = () => {
    if (currentStep === 'grammar') {
      setCurrentStep('reading');
    } else if (currentStep === 'reading') {
      setCurrentStep('listening');
    } else if (currentStep === 'listening') {
      setCurrentStep('writing');
      setWritingTaskIndex(0);
      setWritingTimeLeft(writingTasks[0].duration);
      setWritingTimerActive(true);
    } else if (currentStep === 'writing') {
      setCurrentStep('speaking');
      setSpeakingTaskIndex(0);
      setPrepTimeLeft(speakingTasks[0].prepTime);
      setIsPreparing(false);
      setIsRecording(false);
    } else if (currentStep === 'speaking') {
      const scores = calculateScores();
      setResult(scores);
      setCurrentStep('results');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Audio Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);

        // Store the audio data in the test answers
        const currentTask = speakingTasks[speakingTaskIndex];
        handleAnswerChange('speaking', `${currentTask.id}_audio`, url);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setSpeakTimeLeft(speakingTasks[speakingTaskIndex].speakTime);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please ensure you have granted permission.');
    }
  };

  // Submit test to admin (Formations@conseiluxtraining.com)
  const submitToAdmin = async () => {
    setLoading(true);
    try {
      const currentResult = result || calculateScores();
      
      // Save full result JSON
      await fetch('/api/test-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentData,
          testAnswers,
          result: currentResult,
          testName: "Tracktest B1 & TOEFL Assessment",
          date: new Date().toISOString(),
        }),
      });

      // Send email notification to Formations@conseiluxtraining.com
      await fetch('/api/test-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentData,
          result: currentResult,
          testName: "Tracktest B1 & TOEFL Assessment",
          date: new Date().toISOString(),
        }),
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting test:', error);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`${bgMain} transition-colors duration-300 min-h-screen pb-20 relative`}
      onKeyDown={(event) => {
        if (isBlockedExamShortcut(event.nativeEvent)) {
          event.preventDefault();
          setExamNotice('Attention : les raccourcis navigateur et les tentatives de triche sont désactivés pendant le test.');
        }
      }}
      onCopy={(event) => {
        event.preventDefault();
        setExamNotice('Copie interdite pendant le test.');
      }}
      onCut={(event) => {
        event.preventDefault();
        setExamNotice('Coupure interdite pendant le test.');
      }}
      onPaste={(event) => {
        event.preventDefault();
        setExamNotice('Collage interdit pendant le test.');
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        setExamNotice('Le menu contextuel est désactivé.');
      }}
    >
      {examNotice && (
        <div className="fixed right-4 top-4 z-[60] max-w-sm rounded-2xl border border-red-500/50 bg-[#0a1128] px-4 py-3 text-xs font-semibold text-white shadow-2xl">
          {examNotice}
        </div>
      )}
      {/* ------------------------------------------------------------------- */}
      {/* HEADER HERO BANNER WITH PROFESSIONAL IMAGE                          */}
      {/* ------------------------------------------------------------------- */}
      <section className="relative bg-[#0a1128] text-white py-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&fit=crop&q=80"
            alt="Conseilux Language Center"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1128] via-[#0a1128]/90 to-transparent z-0" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <Link 
            href="/centre-de-langues/certifications" 
            className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors mb-4"
          >
            ← {t.programmesPage.back}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff6b00] rounded-full text-xs font-bold uppercase tracking-wider text-white mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Tracktest B1 &amp; TOEFL iBT Standard
              </span>
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Test de Niveau Complet en Anglais
              </h1>
              <p className="mt-3 text-white/90 text-sm md:text-base leading-relaxed max-w-2xl">
                Évaluez vos compétences à travers 5 sections officielles : <strong className="text-[#ff6b00]">Grammar, Reading, Listening, Writing (3 tâches)</strong> et <strong className="text-[#ff6b00]">Speaking (3 tâches)</strong>.
              </p>
            </div>

            {/* Structure Summary Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl text-center">
              <p className="text-xs uppercase tracking-widest text-white/70 font-semibold">Test d&apos;Évaluation 5 Sections</p>
              <div className="flex justify-center items-baseline gap-1 my-2">
                <span className="text-4xl font-extrabold text-[#ff6b00]">70</span>
                <span className="text-lg font-medium text-white/80">Questions + 6 Tâches</span>
              </div>
              <div className="pt-3 border-t border-white/15 text-xs text-white/80 space-y-1">
                <p>✓ Seuil de réussite B1 : <strong>65% (46/70)</strong></p>
                <p>✓ Rapport envoyé à : <strong>Formations@conseiluxtraining.com</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* SECTION STEPPER INDICATOR WITH IMAGES                                */}
      {/* ------------------------------------------------------------------- */}
      {currentStep !== 'form' && currentStep !== 'results' && (
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center justify-between gap-2 overflow-x-auto bg-white dark:bg-[#111c35] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            {[
              { key: 'grammar', label: '1. Grammar (20)', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&fit=crop&q=80' },
              { key: 'reading', label: '2. Reading (25)', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&fit=crop&q=80' },
              { key: 'listening', label: '3. Listening (25)', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=100&fit=crop&q=80' },
              { key: 'writing', label: '4. Writing (3 Tâches)', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=100&fit=crop&q=80' },
              { key: 'speaking', label: '5. Speaking (4 Tâches)', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&fit=crop&q=80' },
            ].map((step, idx) => (
              <div key={step.key} className="flex items-center gap-2 shrink-0">
                <Image
                  src={step.image}
                  alt={step.key}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg object-cover border-2 border-[#ff6b00]/30"
                />
                <span className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentStep === step.key 
                    ? 'bg-[#ff6b00] text-white shadow-md' 
                    : 'text-slate-600 dark:text-white/70 hover:text-[#ff6b00]'
                }`}>
                  {step.label}
                </span>
                {idx < 4 && <span className="text-slate-300 dark:text-white/20">→</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-6 py-4">
        {/* ----------------------------------------------------------------- */}
        {/* STEP 1: CANDIDATE INFORMATION FORM                                */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 'form' && (
          <div className={`rounded-3xl border-2 border-[#ff6b00] p-8 md:p-10 shadow-2xl ${cardBg}`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Form illustrative image */}
              <div className="md:col-span-5 relative hidden md:block rounded-2xl overflow-hidden shadow-lg h-full min-h-[380px]">
                <Image
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&fit=crop&q=80"
                  alt="Student Registration"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128]/90 via-transparent to-transparent p-6 flex flex-col justify-end text-white">
                  <h3 className="text-lg font-bold">Conseilux Language Assessment</h3>
                  <p className="text-xs text-white/80 mt-1">Vos résultats seront transmis directement à la direction pédagogique.</p>
                </div>
              </div>

              <div className="md:col-span-7">
                <div className="mb-6">
                  <span className="text-xs font-bold text-[#ff6b00] uppercase tracking-wider">Étape Préalable</span>
                  <h2 className="text-2xl md:text-3xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>
                    {tl.formTitle}
                  </h2>
                  <p className={`${textMuted} text-sm mt-1`}>
                    Veuillez préciser vos coordonnées et votre niveau d&apos;étude avant de commencer le test.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                      {tl.nameLabel} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm border ${inputBg} focus:ring-2 focus:ring-[#ff6b00] outline-none ${errors.name ? 'border-red-500' : ''}`}
                        placeholder={language === 'fr' ? 'ex: Jean Dupont' : 'ex: John Doe'}
                        value={studentData.name}
                        onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Educational Background / Level of Study */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                      Niveau d&apos;étude / Diplôme préparé <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm border ${inputBg} focus:ring-2 focus:ring-[#ff6b00] outline-none appearance-none`}
                        value={studentData.educationLevel}
                        onChange={(e) => setStudentData({ ...studentData, educationLevel: e.target.value })}
                      >
                        <option value="Baccalauréat / Lycée">Baccalauréat / Élève de Lycée</option>
                        <option value="Licence / Bachelor (Bac+3)">Licence / Bachelor (Bac+3)</option>
                        <option value="Master / Master de Recherche (Bac+5)">Master / Master de Recherche (Bac+5)</option>
                        <option value="Doctorat / PhD">Doctorat / PhD</option>
                        <option value="Cadre / Professionnel en activité">Cadre / Professionnel en activité</option>
                        <option value="Autre / Formation Continue">Autre / Formation Continue</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                        {tl.emailLabel} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm border ${inputBg} focus:ring-2 focus:ring-[#ff6b00] outline-none ${errors.email ? 'border-red-500' : ''}`}
                          placeholder="jean@email.com"
                          value={studentData.email}
                          onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                        {tl.phoneLabel} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm border ${inputBg} focus:ring-2 focus:ring-[#ff6b00] outline-none ${errors.phone ? 'border-red-500' : ''}`}
                          placeholder="+228 90 00 00 00"
                          value={studentData.phone}
                          onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                        {tl.countryLabel} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm border ${inputBg} focus:ring-2 focus:ring-[#ff6b00] outline-none ${errors.country ? 'border-red-500' : ''}`}
                          placeholder="ex: Togo"
                          value={studentData.country}
                          onChange={(e) => setStudentData({ ...studentData, country: e.target.value })}
                        />
                      </div>
                      {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                        {tl.cityLabel} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm border ${inputBg} focus:ring-2 focus:ring-[#ff6b00] outline-none ${errors.city ? 'border-red-500' : ''}`}
                          placeholder="ex: Lomé"
                          value={studentData.city}
                          onChange={(e) => setStudentData({ ...studentData, city: e.target.value })}
                        />
                      </div>
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                      {tl.companyLabel}
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm border ${inputBg} focus:ring-2 focus:ring-[#ff6b00] outline-none`}
                        placeholder="ex: Organisation / Université"
                        value={studentData.company}
                        onChange={(e) => setStudentData({ ...studentData, company: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#ff6b00] hover:bg-[#e55a00] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl mt-4 text-base flex items-center justify-center gap-2"
                  >
                    <span>Démarrer la Section I: Grammar</span>
                    <span>→</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* STEP 2: SECTION I - GRAMMAR WITH IMAGE                            */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 'grammar' && (
          <div className={`rounded-3xl border-2 border-[#ff6b00] p-8 shadow-2xl ${cardBg}`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-6">
              <div className="md:col-span-8">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-[#ff6b00] uppercase tracking-wider">SECTION I sur 5</span>
                    <h2 className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>
                      Grammar (Use of English)
                    </h2>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-[#ff6b00]/10 text-[#ff6b00] font-bold">
                    20 Questions
                  </span>
                </div>
              </div>
              
              {/* Grammar Section Image */}
              <div className="md:col-span-4 relative rounded-2xl overflow-hidden shadow-lg hidden md:block">
                <Image
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&fit=crop&q=80"
                  alt="Grammar Section"
                  fill
                  className="object-cover min-h-[300px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128]/80 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
                  <p className="text-xs font-bold">Grammar Mastery</p>
                  <p className="text-xs text-white/80 mt-1">Testez vos connaissances grammaticales</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {grammarQuestions.map((q, index) => (
                <div key={q.id} className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#1a2a4a] border-white/5' : 'bg-slate-50 border-slate-200'} transition-all hover:border-[#ff6b00]/40`}>
                  <p className="font-semibold text-base mb-4 flex items-start gap-2">
                    <span className="text-[#ff6b00] font-bold">{index + 1}.</span>
                    <span>{q.question}</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {q.options.map((option, optIndex) => {
                      const optValue = String.fromCharCode(97 + optIndex);
                      const isSelected = testAnswers.grammar[q.id] === optValue;
                      return (
                        <label 
                          key={optIndex} 
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-[#ff6b00] text-white border-[#ff6b00] font-medium shadow-md' 
                              : darkMode ? 'bg-[#111c35] border-white/10 hover:border-white/30' : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={optValue}
                            checked={isSelected}
                            onChange={(e) => handleAnswerChange('grammar', q.id, e.target.value)}
                            className="sr-only"
                          />
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-white text-[#ff6b00]' : 'bg-slate-200 text-slate-700 dark:bg-white/20 dark:text-white'
                          }`}>
                            {optValue.toUpperCase()}
                          </span>
                          <span className="text-sm">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={moveToNextSection}
                className="bg-[#ff6b00] hover:bg-[#e55a00] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>SECTION II: Reading</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* STEP 3: SECTION II - READING WITH IMAGE                           */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 'reading' && (
          <div className={`rounded-3xl border-2 border-[#ff6b00] p-8 shadow-2xl ${cardBg}`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-6">
              <div className="md:col-span-8">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-[#ff6b00] uppercase tracking-wider">SECTION II sur 5</span>
                    <h2 className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>
                      Reading Comprehension
                    </h2>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-[#ff6b00]/10 text-[#ff6b00] font-bold">
                    5 Tasks (25 Questions)
                  </span>
                </div>
              </div>
              
              {/* Reading Section Image */}
              <div className="md:col-span-4 relative rounded-2xl overflow-hidden shadow-lg hidden md:block">
                <Image
                  src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&fit=crop&q=80"
                  alt="Reading Section"
                  fill
                  className="object-cover min-h-[300px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128]/80 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
                  <p className="text-xs font-bold">Reading Skills</p>
                  <p className="text-xs text-white/80 mt-1">Compréhension de texte académique</p>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              {readingTasks.map((task) => (
                <div key={task.id} className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#1a2a4a]/50 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className="text-xl font-bold mb-4 text-[#ff6b00] flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <span>{task.title}</span>
                  </h3>
                  <div className={`p-6 rounded-2xl mb-6 ${darkMode ? 'bg-[#111c35] border border-white/10 text-white/90' : 'bg-white border border-slate-200 text-slate-800'} leading-relaxed font-sans text-sm md:text-base`}>
                    <p className="whitespace-pre-line">{task.passage}</p>
                  </div>

                  <div className="space-y-4">
                    {task.questions.map((q, qIndex) => (
                      <div key={q.id} className={`p-4 rounded-xl border ${darkMode ? 'bg-[#111c35] border-white/10' : 'bg-white border-slate-200'}`}>
                        <p className="font-semibold text-sm md:text-base mb-3 flex items-start gap-2">
                          <span className="text-[#ff6b00]">{qIndex + 1}.</span>
                          <span>{q.question}</span>
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {q.options.map((option, optIndex) => {
                            const optValue = String.fromCharCode(97 + optIndex);
                            const isSelected = testAnswers.reading[q.id] === optValue;
                            return (
                              <label
                                key={optIndex}
                                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-[#ff6b00] text-white border-[#ff6b00] font-medium shadow-md'
                                    : darkMode ? 'bg-[#1a2a4a] border-white/10 hover:border-white/30' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={q.id}
                                  value={optValue}
                                  checked={isSelected}
                                  onChange={(e) => handleAnswerChange('reading', q.id, e.target.value)}
                                  className="sr-only"
                                />
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isSelected ? 'bg-white text-[#ff6b00]' : 'bg-slate-200 text-slate-700 dark:bg-white/20 dark:text-white'
                                }`}>
                                  {optValue.toUpperCase()}
                                </span>
                                <span className="text-sm">{option}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep('grammar')}
                className="bg-slate-500 hover:bg-slate-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all"
              >
                ← SECTION I: Grammar
              </button>
              <button
                onClick={moveToNextSection}
                className="bg-[#ff6b00] hover:bg-[#e55a00] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>SECTION III: Listening</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* STEP 4: SECTION III - LISTENING WITH IMAGE                         */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 'listening' && (
          <div className={`rounded-3xl border-2 border-[#ff6b00] p-8 shadow-2xl ${cardBg}`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-6">
              <div className="md:col-span-8">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-[#ff6b00] uppercase tracking-wider">SECTION III sur 5</span>
                    <h2 className="text-2xl font-bold mt-1" style={{ fontFamily: "var(--font-display)" }}>
                      Listening Comprehension
                    </h2>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-[#ff6b00]/10 text-[#ff6b00] font-bold">
                    5 Audio Tasks (25 Questions)
                  </span>
                </div>
              </div>
              
              {/* Listening Section Image */}
              <div className="md:col-span-4 relative rounded-2xl overflow-hidden shadow-lg hidden md:block">
                <Image
                  src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&fit=crop&q=80"
                  alt="Listening Section"
                  fill
                  className="object-cover min-h-[300px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128]/80 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
                  <p className="text-xs font-bold">Listening Skills</p>
                  <p className="text-xs text-white/80 mt-1">Compréhension orale audio</p>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              {listeningTasks.map((task) => (
                <div key={task.id} className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#1a2a4a]/50 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className="text-xl font-bold mb-1 text-[#ff6b00] flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    <span>{task.title}</span>
                  </h3>
                  <p className={`text-xs italic mb-4 ${textMuted}`}>{task.instruction}</p>
                  
                  {/* Audio Player */}
                  <div className={`p-4 rounded-xl mb-6 flex items-center gap-4 ${darkMode ? 'bg-[#111c35] border border-white/10' : 'bg-white border border-slate-200 shadow-sm'}`}>
                    <div className="w-10 h-10 rounded-full bg-[#ff6b00] text-white flex items-center justify-center shrink-0">
                      <Volume2 className="w-5 h-5 animate-pulse" />
                    </div>
                    <audio controls className="w-full">
                      <source src={task.audioFile} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>

                  <div className="space-y-4">
                    {task.questions.map((q) => (
                      <div key={q.id} className={`p-4 rounded-xl border ${darkMode ? 'bg-[#111c35] border-white/10' : 'bg-white border-slate-200'}`}>
                        <p className="font-semibold text-sm md:text-base mb-3">
                          {q.question}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {q.options.map((option, optIndex) => {
                            const optValue = String.fromCharCode(97 + optIndex);
                            const isSelected = testAnswers.listening[q.id] === optValue;
                            return (
                              <label
                                key={optIndex}
                                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-[#ff6b00] text-white border-[#ff6b00] font-medium shadow-md'
                                    : darkMode ? 'bg-[#1a2a4a] border-white/10 hover:border-white/30' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={q.id}
                                  value={optValue}
                                  checked={isSelected}
                                  onChange={(e) => handleAnswerChange('listening', q.id, e.target.value)}
                                  className="sr-only"
                                />
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isSelected ? 'bg-white text-[#ff6b00]' : 'bg-slate-200 text-slate-700 dark:bg-white/20 dark:text-white'
                                }`}>
                                  {optValue.toUpperCase()}
                                </span>
                                <span className="text-sm">{option}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentStep('reading')}
                className="bg-slate-500 hover:bg-slate-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all"
              >
                ← SECTION II: Reading
              </button>
              <button
                onClick={moveToNextSection}
                className="bg-[#ff6b00] hover:bg-[#e55a00] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>SECTION IV: Writing (TOEFL)</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* STEP 5: SECTION IV - WRITING (TOEFL 3 TASKS) WITH IMAGE            */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 'writing' && (
          <div className={`rounded-3xl border-2 border-[#ff6b00] p-8 shadow-2xl ${cardBg}`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-6">
              <div className="md:col-span-8">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-[#ff6b00] uppercase tracking-wider">SECTION IV sur 5</span>
                    <h2 className="text-2xl font-bold mt-1 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                      <PenTool className="w-6 h-6 text-[#ff6b00]" />
                      <span>Writing Section (TOEFL iBT Format)</span>
                    </h2>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-[#ff6b00]/10 text-[#ff6b00] font-bold">
                    3 Tâches Rédigées
                  </span>
                </div>
              </div>
              
              {/* Writing Section Image */}
              <div className="md:col-span-4 relative rounded-2xl overflow-hidden shadow-lg hidden md:block">
                <Image
                  src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&fit=crop&q=80"
                  alt="Writing Section"
                  fill
                  className="object-cover min-h-[300px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128]/80 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
                  <p className="text-xs font-bold">Writing Skills</p>
                  <p className="text-xs text-white/80 mt-1">Rédaction académique TOEFL</p>
                </div>
              </div>
            </div>

            {/* Task Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-3 overflow-x-auto">
              {writingTasks.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setWritingTaskIndex(idx);
                    setWritingTimeLeft(t.duration);
                    setWritingTimerActive(true);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    writingTaskIndex === idx
                      ? 'bg-[#ff6b00] text-white shadow-md'
                      : darkMode ? 'bg-[#1a2a4a] text-white/70' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Tâche {idx + 1}
                </button>
              ))}
            </div>

            {/* Active Writing Task */}
            {(() => {
              const currentTask = writingTasks[writingTaskIndex];
              const userText = testAnswers.writing[currentTask.id] || '';
              const wordCount = userText.trim().split(/\s+/).filter(Boolean).length;

              return (
                <div className="space-y-6">
                  {/* Task Header & Timer */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#ff6b00]/10 p-4 rounded-2xl border border-[#ff6b00]/20">
                    <div>
                      <h3 className="font-bold text-lg text-[#ff6b00]">{currentTask.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-white/70 mt-0.5">Objectif : {currentTask.targetWords}</p>
                    </div>

                    <div className="flex items-center gap-3 bg-white dark:bg-[#111c35] px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10">
                      <Clock className="w-4 h-4 text-[#ff6b00]" />
                      <span className="font-mono font-bold text-lg text-[#ff6b00]">{formatTime(writingTimeLeft)}</span>
                    </div>
                  </div>

                  {/* Prompt Box */}
                  <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#1a2a4a] border-white/10' : 'bg-slate-50 border-slate-200'} leading-relaxed font-sans text-sm md:text-base`}>
                    <p className="whitespace-pre-line">{currentTask.prompt}</p>
                  </div>

                  {/* Textarea Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider">Votre Rédaction en Anglais :</label>
                      <span className={`text-xs font-bold ${wordCount >= currentTask.minWords ? 'text-green-500' : 'text-slate-400'}`}>
                        {wordCount} mots (Minimum : {currentTask.minWords} mots)
                      </span>
                    </div>
                    <textarea
                      rows={10}
                      className={`w-full p-4 rounded-2xl border ${inputBg} focus:ring-2 focus:ring-[#ff6b00] outline-none text-sm font-sans resize-y leading-relaxed`}
                      placeholder="Write your response in English here..."
                      value={userText}
                      onChange={(e) => handleAnswerChange('writing', currentTask.id, e.target.value)}
                    />
                  </div>

                  {/* Task navigation */}
                  <div className="flex justify-between pt-4">
                    {writingTaskIndex > 0 ? (
                      <button
                        onClick={() => {
                          setWritingTaskIndex(prev => prev - 1);
                          setWritingTimeLeft(writingTasks[writingTaskIndex - 1].duration);
                          setWritingTimerActive(true);
                        }}
                        className="bg-slate-500 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                      >
                        ← Tâche Précédente
                      </button>
                    ) : <div />}

                    {writingTaskIndex < writingTasks.length - 1 ? (
                      <button
                        onClick={() => {
                          setWritingTaskIndex(prev => prev + 1);
                          setWritingTimeLeft(writingTasks[writingTaskIndex + 1].duration);
                          setWritingTimerActive(true);
                        }}
                        className="bg-[#ff6b00] hover:bg-[#e55a00] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md"
                      >
                        Tâche Suivante →
                      </button>
                    ) : (
                      <button
                        onClick={moveToNextSection}
                        className="bg-[#ff6b00] hover:bg-[#e55a00] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md flex items-center gap-2"
                      >
                        <span>SECTION V: Speaking (TOEFL)</span>
                        <span>→</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* STEP 6: SECTION V - SPEAKING (TOEFL 3 TASKS) WITH IMAGE            */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 'speaking' && (
          <div className={`rounded-3xl border-2 border-[#ff6b00] p-8 shadow-2xl ${cardBg}`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-6">
              <div className="md:col-span-8">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4 mb-6">
                  <div>
                    <span className="text-xs font-bold text-[#ff6b00] uppercase tracking-wider">SECTION V sur 5</span>
                    <h2 className="text-2xl font-bold mt-1 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                      <Mic className="w-6 h-6 text-[#ff6b00]" />
                      <span>Speaking Section (TOEFL iBT Format)</span>
                    </h2>
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full bg-[#ff6b00]/10 text-[#ff6b00] font-bold">
                    3 Tâches Orales
                  </span>
                </div>
              </div>
              
              {/* Speaking Section Image */}
              <div className="md:col-span-4 relative rounded-2xl overflow-hidden shadow-lg hidden md:block">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&fit=crop&q=80"
                  alt="Speaking Section"
                  fill
                  className="object-cover min-h-[300px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128]/80 via-transparent to-transparent p-4 flex flex-col justify-end text-white">
                  <p className="text-xs font-bold">Speaking Skills</p>
                  <p className="text-xs text-white/80 mt-1">Expression orale TOEFL</p>
                </div>
              </div>
            </div>

            {/* Task Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-3 overflow-x-auto">
              {speakingTasks.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSpeakingTaskIndex(idx);
                    setPrepTimeLeft(t.prepTime);
                    setIsPreparing(false);
                    setIsRecording(false);
                    speakTask(t);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    speakingTaskIndex === idx
                      ? 'bg-[#ff6b00] text-white shadow-md'
                      : darkMode ? 'bg-[#1a2a4a] text-white/70' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Tâche {idx + 1}
                </button>
              ))}
            </div>

            {/* Active Speaking Task */}
            {(() => {
              const currentTask = speakingTasks[speakingTaskIndex];
              const notesText = testAnswers.speaking[currentTask.id] || '';

              return (
                <div className="space-y-6">
                  {/* Task Header with Assistant */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-[#ff6b00]/10 p-4 rounded-2xl border border-[#ff6b00]/20">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ff6b00]">{currentTask.type}</span>
                      <h3 className="font-bold text-lg text-[#ff6b00] mt-0.5">{currentTask.title}</h3>
                    </div>
                    
                    {/* Virtual Assistant Avatar */}
                    <div className="bg-gradient-to-br from-[#0a1128] to-[#1a2a4a] p-4 rounded-2xl border border-[#ff6b00]/30 text-center">
                      <div className="relative mx-auto w-20 h-20 rounded-full overflow-hidden border-3 border-[#ff6b00] mb-3">
                        <Image
                          src={currentTask.assistantImage}
                          alt={currentTask.assistantName}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                      </div>
                      <p className="text-white font-bold text-sm">{currentTask.assistantName}</p>
                      <p className="text-[#ff6b00] text-xs">{currentTask.assistantRole}</p>
                    </div>
                  </div>

                  {/* Reading Passage if integrated task */}
                  {currentTask.passage && (
                    <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#1a2a4a] border-white/10' : 'bg-slate-50 border-slate-200'} text-sm leading-relaxed`}>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#ff6b00] mb-2">Source Passage :</h4>
                      <p className="whitespace-pre-line">{currentTask.passage}</p>
                    </div>
                  )}

                  {/* Audio Context if integrated task */}
                  {'audioFile' in currentTask && currentTask.audioFile && (
                    <div className={`p-4 rounded-xl flex items-center gap-4 ${darkMode ? 'bg-[#111c35] border border-white/10' : 'bg-white border border-slate-200 shadow-sm'}`}>
                      <Volume2 className="w-5 h-5 text-[#ff6b00]" />
                      <audio controls className="w-full">
                        <source src={currentTask.audioFile} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}

                  {/* Prompt Box */}
                  <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#111c35] border-white/10' : 'bg-white border-slate-200'} text-sm leading-relaxed font-sans`}>
                    <p className="whitespace-pre-line font-medium">{currentTask.prompt}</p>
                  </div>

                  {/* TOEFL Timers & Mic Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => speakTask(currentTask)}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#ff6b00]/30 bg-[#ff6b00]/10 px-4 py-2 text-xs font-bold text-[#ff6b00] transition hover:bg-[#ff6b00]/15"
                      >
                        <Volume2 className="w-4 h-4" />
                        Lire la consigne à voix haute
                      </button>
                    </div>

                    {/* Preparation Card */}
                    <div className={`p-5 rounded-2xl border text-center ${
                      isPreparing ? 'bg-amber-500/10 border-amber-500/40 text-amber-600' : darkMode ? 'bg-[#1a2a4a] border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <p className="text-xs font-bold uppercase tracking-wider">Préparation ({currentTask.prepTime}s)</p>
                      <p className="text-3xl font-extrabold my-2">{isPreparing ? `${prepTimeLeft}s` : `${currentTask.prepTime}s`}</p>
                      <button
                        onClick={() => {
                          setPrepTimeLeft(currentTask.prepTime);
                          setIsPreparing(true);
                          setIsRecording(false);
                        }}
                        disabled={isPreparing || isRecording}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Démarrer la Préparation</span>
                      </button>
                    </div>

                    {/* Speaking Response Card */}
                    <div className={`p-5 rounded-2xl border text-center ${
                      isRecording ? 'bg-red-500/10 border-red-500/40 text-red-600' : darkMode ? 'bg-[#1a2a4a] border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <p className="text-xs font-bold uppercase tracking-wider">Enregistrement ({currentTask.speakTime}s)</p>
                      <p className="text-3xl font-extrabold my-2">{isRecording ? `${speakTimeLeft}s` : `${currentTask.speakTime}s`}</p>
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isPreparing}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        <Mic className="w-4 h-4" />
                        <span>{isRecording ? 'Arrêter l\'Enregistrement' : 'Démarrer l\'Enregistrement'}</span>
                      </button>
                      
                      {/* Audio Playback */}
                      {recordedAudioUrl && !isRecording && (
                        <div className="mt-3">
                          <audio controls className="w-full" src={recordedAudioUrl}>
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Speaking Notes Field */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1">
                      Notes de Synthèse Orales / Points Clés en Anglais :
                    </label>
                    <textarea
                      rows={4}
                      className={`w-full p-4 rounded-2xl border ${inputBg} focus:ring-2 focus:ring-[#ff6b00] outline-none text-sm font-sans resize-y`}
                      placeholder="Note down your main speaking bullet points here..."
                      value={notesText}
                      onChange={(e) => handleAnswerChange('speaking', currentTask.id, e.target.value)}
                    />
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-4">
                    {speakingTaskIndex > 0 ? (
                      <button
                        onClick={() => {
                          setSpeakingTaskIndex(prev => prev - 1);
                          setPrepTimeLeft(speakingTasks[speakingTaskIndex - 1].prepTime);
                          setIsPreparing(false);
                          setIsRecording(false);
                        }}
                        className="bg-slate-500 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all"
                      >
                        ← Tâche Précédente
                      </button>
                    ) : <div />}

                    {speakingTaskIndex < speakingTasks.length - 1 ? (
                      <button
                        onClick={() => {
                          setSpeakingTaskIndex(prev => prev + 1);
                          setPrepTimeLeft(speakingTasks[speakingTaskIndex + 1].prepTime);
                          setIsPreparing(false);
                          setIsRecording(false);
                          setRecordedAudioUrl(null);
                        }}
                        className="bg-[#ff6b00] hover:bg-[#e55a00] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md"
                      >
                        Tâche Suivante →
                      </button>
                    ) : (
                      <button
                        onClick={moveToNextSection}
                        className="bg-[#ff6b00] hover:bg-[#e55a00] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md flex items-center gap-2"
                      >
                        <span>Terminer et Générer les Résultats</span>
                        <span>✓</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* STEP 7: RESULTS & ADMIN SUBMISSION DASHBOARD                      */}
        {/* ----------------------------------------------------------------- */}
        {currentStep === 'results' && result && (
          <div className={`rounded-3xl border-2 border-[#ff6b00] p-8 md:p-10 shadow-2xl ${cardBg}`}>
            {!submitted ? (
              <>
                <div className="text-center mb-8">
                  {result.passed ? (
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <Award className="w-10 h-10" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <AlertTriangle className="w-10 h-10" />
                    </div>
                  )}

                  <span className="inline-block px-4 py-1.5 bg-[#ff6b00]/10 text-[#ff6b00] rounded-full text-xs font-extrabold tracking-wider uppercase mb-2">
                    Evaluation Officielle 5 Sections
                  </span>

                  <h2 className="text-3xl font-extrabold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    {result.passed ? "Félicitations ! Niveau B1 Validé" : "Bilan complet de votre Test de Niveau"}
                  </h2>
                  <p className={`${textMuted} text-base max-w-2xl mx-auto`}>
                    Candidat : <strong>{studentData.name}</strong> ({studentData.educationLevel})
                  </p>
                </div>

                {/* Score Dashboard Banner */}
                <div className={`p-8 rounded-3xl text-center mb-8 border ${
                  result.passed 
                    ? darkMode ? 'bg-[#1a2a4a] border-green-500/30' : 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200' 
                    : darkMode ? 'bg-[#1a2a4a] border-amber-500/30' : 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200'
                }`}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                    <div>
                      <p className={`text-xs uppercase font-extrabold tracking-wider ${textMuted}`}>Score Total Core (70 Qs)</p>
                      <p className="text-4xl font-black text-[#ff6b00] mt-1">{result.totalCoreScore} / 70</p>
                    </div>

                    <div className="sm:border-x border-slate-300 dark:border-white/10 px-4 py-2">
                      <p className={`text-xs uppercase font-extrabold tracking-wider ${textMuted}`}>Pourcentage Global</p>
                      <p className={`text-5xl font-black mt-1 ${result.passed ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {result.percentage}%
                      </p>
                      <span className="inline-block mt-2 px-3 py-1 bg-white/80 dark:bg-black/40 rounded-full text-xs font-bold">
                        Seuil B1 Tracktest : 65%
                      </span>
                    </div>

                    <div>
                      <p className={`text-xs uppercase font-extrabold tracking-wider ${textMuted}`}>Niveau Attribué</p>
                      <p className="text-4xl font-black text-[#ff6b00] mt-1">{result.level}</p>
                    </div>
                  </div>
                </div>

                {/* 5-Section Detailed Score Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  <div className={`p-5 rounded-2xl border text-center ${darkMode ? 'bg-[#1a2a4a] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <p className={`text-xs font-bold uppercase ${textMuted}`}>1. Grammar</p>
                    <p className="text-2xl font-black text-[#ff6b00] mt-2">{result.grammarScore} / 20</p>
                    <p className="text-xs text-slate-500 mt-1">{Math.round((result.grammarScore / 20) * 100)}%</p>
                  </div>

                  <div className={`p-5 rounded-2xl border text-center ${darkMode ? 'bg-[#1a2a4a] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <p className={`text-xs font-bold uppercase ${textMuted}`}>2. Reading</p>
                    <p className="text-2xl font-black text-[#ff6b00] mt-2">{result.readingScore} / 25</p>
                    <p className="text-xs text-slate-500 mt-1">{Math.round((result.readingScore / 25) * 100)}%</p>
                  </div>

                  <div className={`p-5 rounded-2xl border text-center ${darkMode ? 'bg-[#1a2a4a] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <p className={`text-xs font-bold uppercase ${textMuted}`}>3. Listening</p>
                    <p className="text-2xl font-black text-[#ff6b00] mt-2">{result.listeningScore} / 25</p>
                    <p className="text-xs text-slate-500 mt-1">{Math.round((result.listeningScore / 25) * 100)}%</p>
                  </div>

                  <div className={`p-5 rounded-2xl border text-center ${darkMode ? 'bg-[#1a2a4a] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <p className={`text-xs font-bold uppercase ${textMuted}`}>4. Writing (TOEFL)</p>
                    <p className="text-2xl font-black text-[#ff6b00] mt-2">{result.writingScore} / 15</p>
                    <p className="text-xs text-slate-500 mt-1">3 Tâches</p>
                  </div>

                  <div className={`p-5 rounded-2xl border text-center ${darkMode ? 'bg-[#1a2a4a] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <p className={`text-xs font-bold uppercase ${textMuted}`}>5. Speaking (TOEFL)</p>
                    <p className="text-2xl font-black text-[#ff6b00] mt-2">{result.speakingScore} / 15</p>
                    <p className="text-xs text-slate-500 mt-1">3 Tâches</p>
                  </div>
                </div>

                {/* Direct submission to Admin Formations@conseiluxtraining.com */}
                <div className="bg-[#ff6b00]/10 p-6 rounded-2xl border border-[#ff6b00]/20 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-base text-[#ff6b00]">Transmission Automatique des Scores</h4>
                    <p className="text-xs text-slate-600 dark:text-white/80 mt-1">
                      Vos scores pour les 5 sections ainsi que votre niveau d&apos;étude (<strong>{studentData.educationLevel}</strong>) seront envoyés à l&apos;adresse administration : <strong>Formations@conseiluxtraining.com</strong>.
                    </p>
                  </div>

                  <button
                    onClick={submitToAdmin}
                    disabled={loading}
                    className="w-full sm:w-auto bg-[#ff6b00] hover:bg-[#e55a00] text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl shrink-0 flex items-center justify-center gap-2 text-base"
                  >
                    {loading ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Envoyer les Scores à l&apos;Administration</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Success confirmation state */
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-extrabold mb-3 text-green-600 dark:text-green-400">
                  Scores Transmis avec Succès !
                </h2>
                <p className={`mb-8 max-w-lg mx-auto ${textMuted} leading-relaxed text-sm md:text-base`}>
                  L&apos;administration Conseilux Training (<strong>Formations@conseiluxtraining.com</strong>) a reçu la notification détaillée de vos 5 sections de test ainsi que votre niveau d&apos;étude (<strong>{studentData.educationLevel}</strong>). Un conseiller vous contactera sous peu.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/centre-de-langues/certifications"
                    className="inline-flex items-center justify-center gap-2 bg-[#ff6b00] hover:bg-[#e55a00] text-white font-bold py-4 px-8 rounded-xl transition-all shadow-md"
                  >
                    Voir les Certifications &amp; Programmes
                  </Link>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-xl transition-all"
                  >
                    <Download className="w-5 h-5" />
                    Imprimer mon Relevé de Score
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}