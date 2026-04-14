import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import './App.css';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  onSnapshot, 
  serverTimestamp,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Users, 
  LogOut, 
  ChevronDown, 
  Filter,
  Lock,
  Plus,
  RefreshCw,
  LogIn,
  AlertCircle,
  Eye,
  EyeOff,
  Save 
} from 'lucide-react';

// --- Firebase Initialization ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "iwaimedeta-7af67.firebaseapp.com",
  projectId: "iwaimedeta-7af67",
  storageBucket: "iwaimedeta-7af67.firebasestorage.app",
  messagingSenderId: "589772336981",
  appId: "1:589772336981:web:7b87414edc2018f32b49dc",
  measurementId: "G-7Z7WLDS9FK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- Constants & Config ---
const FAMILIES = [
  "おせきファミリー",
  "けんすけファミリー",
  "スクラブファミリー",
  "みやぞんファミリー",
  "ちーたるファミリー",
  "ばなファミリー",
  "ぴーファミリー",
  "ぴょんファミリー",
  "まちゃぴファミリー",
  "みぃファミリー",
  "ゆつきファミリー",
  "甘ドリファミリー"
];

// ★★★ メンバー名簿 ★★★
const MEMBER_LIST = [
  // おせきファミリー
  { family: "おせきファミリー", name: "おせき" },
  { family: "おせきファミリー", name: "のん" },
  { family: "おせきファミリー", name: "ぴーじー" },
  { family: "おせきファミリー", name: "れんれん" },
  { family: "おせきファミリー", name: "夜露死苦" },
  { family: "おせきファミリー", name: "菅原瑛斗" },
  { family: "おせきファミリー", name: "まつこ" },
  { family: "おせきファミリー", name: "おとも" },
  { family: "おせきファミリー", name: "おまゆ" },
  { family: "おせきファミリー", name: "ねずみ先輩" },
  { family: "おせきファミリー", name: "そそ" },
  { family: "おせきファミリー", name: "あいか" },

  // けんすけファミリー
  { family: "けんすけファミリー", name: "健康なスケベ" },
  { family: "けんすけファミリー", name: "れいす" },
  { family: "けんすけファミリー", name: "フェンネル" },
  { family: "けんすけファミリー", name: "ひとかひめ" },
  { family: "けんすけファミリー", name: "やまと" },
  { family: "けんすけファミリー", name: "いもかれ" },
  { family: "けんすけファミリー", name: "そうり" },
  { family: "けんすけファミリー", name: "おかわり" },
  { family: "けんすけファミリー", name: "ゆきの" },
  { family: "けんすけファミリー", name: "なな氏" },
  { family: "けんすけファミリー", name: "こばなな" },
  { family: "けんすけファミリー", name: "かに" },

  // スクラブファミリー
  { family: "スクラブファミリー", name: "スクラブ" },
  { family: "スクラブファミリー", name: "わたけー" },
  { family: "スクラブファミリー", name: "かなん" },
  { family: "スクラブファミリー", name: "なむ" },
  { family: "スクラブファミリー", name: "きくまる。" },
  { family: "スクラブファミリー", name: "ほっさ" },
  { family: "スクラブファミリー", name: "あぼ" },
  { family: "スクラブファミリー", name: "ひめ" },
  { family: "スクラブファミリー", name: "あらいだひなの" },
  { family: "スクラブファミリー", name: "あさこ" },
  { family: "スクラブファミリー", name: "ちゃあ" },
  { family: "スクラブファミリー", name: "くり" },

  // みやぞんファミリー
  { family: "みやぞんファミリー", name: "みやぞん" },
  { family: "みやぞんファミリー", name: "ちょね" },
  { family: "みやぞんファミリー", name: "キャラキャラメルト" },
  { family: "みやぞんファミリー", name: "そうたろう" },
  { family: "みやぞんファミリー", name: "りょう" },
  { family: "みやぞんファミリー", name: "ボンバボン" },
  { family: "みやぞんファミリー", name: "ぺそ" },
  { family: "みやぞんファミリー", name: "ドリー！" },
  { family: "みやぞんファミリー", name: "ジェニファー" },
  { family: "みやぞんファミリー", name: "パトラッシュ" },
  { family: "みやぞんファミリー", name: "ちゃんもり" },
  { family: "みやぞんファミリー", name: "鈴木ひかり" },

  // ちーたるファミリー
  { family: "ちーたるファミリー", name: "ちーたる" },
  { family: "ちーたるファミリー", name: "八重" },
  { family: "ちーたるファミリー", name: "りょく" },
  { family: "ちーたるファミリー", name: "とーま" },
  { family: "ちーたるファミリー", name: "めい" },
  { family: "ちーたるファミリー", name: "どりー" },
  { family: "ちーたるファミリー", name: "ヤスキ" },
  { family: "ちーたるファミリー", name: "ましま" },
  { family: "ちーたるファミリー", name: "じょにー" },
  { family: "ちーたるファミリー", name: "まーや" },
  { family: "ちーたるファミリー", name: "ぜよ" },
  { family: "ちーたるファミリー", name: "せら" },

  // ばなファミリー
  { family: "ばなファミリー", name: "ばな" },
  { family: "ばなファミリー", name: "IC" },
  { family: "ばなファミリー", name: "きょうこ" },
  { family: "ばなファミリー", name: "こーしろー" },
  { family: "ばなファミリー", name: "公太郎" },
  { family: "ばなファミリー", name: "ティミー" },
  { family: "ばなファミリー", name: "ななとう" },
  { family: "ばなファミリー", name: "あんな" },
  { family: "ばなファミリー", name: "ねこ" },
  { family: "ばなファミリー", name: "ポメロン" },
  { family: "ばなファミリー", name: "なつ" },
  { family: "ばなファミリー", name: "シオン" },

  // ぴーファミリー
  { family: "ぴーファミリー", name: "ぴー" },
  { family: "ぴーファミリー", name: "おっくん" },
  { family: "ぴーファミリー", name: "そういち" },
  { family: "ぴーファミリー", name: "あべりな" },
  { family: "ぴーファミリー", name: "ながしー" },
  { family: "ぴーファミリー", name: "しゅんすけ" },
  { family: "ぴーファミリー", name: "もえきゅん" },
  { family: "ぴーファミリー", name: "かんな" },
  { family: "ぴーファミリー", name: "鈴木優花" },
  { family: "ぴーファミリー", name: "とぅーりお" },
  { family: "ぴーファミリー", name: "かごめ" },

  // ぴょんファミリー
  { family: "ぴょんファミリー", name: "ぴょん" },
  { family: "ぴょんファミリー", name: "サツカワ　レオ" },
  { family: "ぴょんファミリー", name: "さき" },
  { family: "ぴょんファミリー", name: "カマンベール・ビオ" },
  { family: "ぴょんファミリー", name: "橋本太郎" },
  { family: "ぴょんファミリー", name: "ももな" },
  { family: "ぴょんファミリー", name: "はまお" },
  { family: "ぴょんファミリー", name: "まりあ" },
  { family: "ぴょんファミリー", name: "さら" },
  { family: "ぴょんファミリー", name: "ひかり" },
  { family: "ぴょんファミリー", name: "なっち" },
  { family: "ぴょんファミリー", name: "れん" },

  // まちゃぴファミリー
  { family: "まちゃぴファミリー", name: "まちゃぴ" },
  { family: "まちゃぴファミリー", name: "ことー" },
  { family: "まちゃぴファミリー", name: "たかゆか" },
  { family: "まちゃぴファミリー", name: "超会議" },
  { family: "まちゃぴファミリー", name: "こーじ" },
  { family: "まちゃぴファミリー", name: "レイバックイナバウアー" },
  { family: "まちゃぴファミリー", name: "ふうちゃん" },
  { family: "まちゃぴファミリー", name: "りな" },
  { family: "まちゃぴファミリー", name: "るな" },
  { family: "まちゃぴファミリー", name: "わか" },
  { family: "まちゃぴファミリー", name: "とみー" },

  // みぃファミリー
  { family: "みぃファミリー", name: "みぃ" },
  { family: "みぃファミリー", name: "ぺちか" },
  { family: "みぃファミリー", name: "たいしょー" },
  { family: "みぃファミリー", name: "いちを" },
  { family: "みぃファミリー", name: "たかてぃん" },
  { family: "みぃファミリー", name: "あすみん" },
  { family: "みぃファミリー", name: "しまめい" },
  { family: "みぃファミリー", name: "むらさき" },
  { family: "みぃファミリー", name: "しまこ" },
  { family: "みぃファミリー", name: "こんのほのか" },
  { family: "みぃファミリー", name: "あずみ" },
  { family: "みぃファミリー", name: "いもたる" },

  // ゆつきファミリー
  { family: "ゆつきファミリー", name: "ゆつき" },
  { family: "ゆつきファミリー", name: "ちゅーきち" },
  { family: "ゆつきファミリー", name: "びっくりドンキー" },
  { family: "ゆつきファミリー", name: "佐藤悠貴" },
  { family: "ゆつきファミリー", name: "ゆきち" },
  { family: "ゆつきファミリー", name: "バンクシー" },
  { family: "ゆつきファミリー", name: "ちゃくみ" },
  { family: "ゆつきファミリー", name: "ふなはら" },
  { family: "ゆつきファミリー", name: "ほっしー" },
  { family: "ゆつきファミリー", name: "ぽこ" },
  { family: "ゆつきファミリー", name: "4649" },
  { family: "ゆつきファミリー", name: "らび" },

  // 甘ドリファミリー
  { family: "甘ドリファミリー", name: "甘どり" },
  { family: "甘ドリファミリー", name: "スナ" },
  { family: "甘ドリファミリー", name: "少年" },
  { family: "甘ドリファミリー", name: "みやたか" },
  { family: "甘ドリファミリー", name: "さくら" },
  { family: "甘ドリファミリー", name: "アミーゴ" },
  { family: "甘ドリファミリー", name: "マロ" },
  { family: "甘ドリファミリー", name: "いなげひかりこ" },
  { family: "甘ドリファミリー", name: "りーしゃん" },
  { family: "甘ドリファミリー", name: "田中真菜実" },
  { family: "甘ドリファミリー", name: "ゆり" },
  { family: "甘ドリファミリー", name: "みどり" },
];

const STATUS_OPTIONS = {
  present: { label: '出席', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle2 },
  absent: { label: '欠席', color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle },
  late: { label: '遅刻/早退', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: HelpCircle },
  tentative: { label: '未確定', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: HelpCircle },
  undecided: { label: '未定', color: 'bg-gray-100 text-gray-500 border-gray-200', icon: HelpCircle },
};

const ADMIN_PASSWORD = "729yosa"; 

// --- Helper Functions ---
const getDayInfo = (dateString) => {
  if (!dateString) return { dayStr: '', colorClass: 'bg-gray-100 text-gray-600' };
  
  const [y, m, d] = dateString.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayIndex = date.getDay(); 
  const days = ['(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)'];
  const dayStr = days[dayIndex];

  let colorClass = 'bg-gray-100 text-gray-600'; 
  if (dayIndex === 0) colorClass = 'bg-green-100 text-green-700 border-green-200'; // Sun: Green
  if (dayIndex === 3) colorClass = 'bg-cyan-100 text-cyan-700 border-cyan-200';   // Wed: Light Blue
  if (dayIndex === 6) colorClass = 'bg-pink-100 text-pink-700 border-pink-200';   // Sat: Pink

  return { dayStr, colorClass };
};

// LocalStorage Key
const LS_USER_ID_KEY = `yosakoi_app_user_id_${appId}`;

// --- Components ---

// ダルマSVGコンポーネント
const DarumaIcon = ({ color, className, style }) => {
const imageSrc = color === 'red' 
    ? '/images/red_daruma-.png'  
    : '/images/blue_daruma.png'; 

  return (
    <img 
      src={imageSrc} 
      alt={`${color} daruma`}
      className={`daruma-icon ${className}`} 
      style={{ 
        ...style, 
        objectFit: 'contain' ,
        mixBlendMode: 'multiply'
      }} 
    />
  );
};

// 背景アニメーションコンポーネント
const DarumaBackground = () => {
  const darumas = useMemo(() => {
    const items = [];
    const count = 18; 

    for (let i = 0; i < count; i++) {
      const isRed = Math.random() > 0.5;
      const size = 30 + Math.random() * 50; 
      const animationType = ['anim-roll', 'anim-bounce', 'anim-sway'][Math.floor(Math.random() * 3)];
      
      let duration;
      if (animationType === 'anim-bounce') {
        duration = 1.5 + Math.random() * 1.5; 
      } else if (animationType === 'anim-roll') {
        duration = 5 + Math.random() * 5;    
      } else {
        duration = 2 + Math.random() * 4;    
      }

      const delay = Math.random() * 5;
      const top = Math.random() * 90; 
      const left = Math.random() * 90;

      items.push({
        id: i,
        color: isRed ? 'red' : 'blue',
        size,
        animationType,
        style: {
          width: `${size}px`,
          height: `${size}px`,
          top: animationType === 'anim-roll' ? `${Math.random() * 80 + 10}%` : `${top}%`,
          left: animationType === 'anim-roll' ? '-100px' : `${left}%`, 
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }
      });
    }
    return items;
  }, []);

  return (
    <div className="modern-gradient-bg">
      {darumas.map((d) => (
        <DarumaIcon 
          key={d.id} 
          color={d.color} 
          className={d.animationType}
          style={d.style}
        />
      ))}
    </div>
  );
};


// 1. Auth Screen
const AuthScreen = ({ onLogin }) => {
  const [family, setFamily] = useState('');
  const [selectedName, setSelectedName] = useState('');

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const familyMembers = useMemo(() => {
    if (!family) return [];
    
    return MEMBER_LIST
      .filter(m => m.family === family)
      .sort((a, b) => 0); 
  }, [family]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (family && selectedName) {
      onLogin(family, selectedName);
    }
  };

  const showAlert = (msg) => {
    setErrorMessage(msg);
    setShowError(true);
  };

  const closeAlert = () => {
    setShowError(false);
  };

  return (
<div className="min-h-screen flex items-center justify-center p-4 safe-area-top safe-area-bottom relative overflow-hidden">
      
      <DarumaBackground />

      {showError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs text-center border border-gray-100 transform transition-all scale-100">
            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">確認してください</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">
              {errorMessage}
            </p>
            <button 
              onClick={closeAlert}
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 active:scale-95 transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 w-full max-w-sm border border-white/50 relative z-10">
        <div className="text-center mb-6">
          <div className="w-28 h-28 mx-auto mb-4 flex items-center justify-center">
            <img 
              src="/images/七福アイコン.png" 
              alt="チームロゴ" 
              className="w-full h-full object-contain drop-shadow-xl" 
            />
          </div>
          <h1 className="text-xl font-bold text-gray-800">練習出欠管理アプリ</h1>
          <p className="text-xs text-gray-400 mt-1">ログイン画面</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-start text-xs text-blue-700 mb-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>あなたの所属ファミリーと名前を選んで
                「ログイン」を押してください。</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">所属ファミリー</label>
            <div className="relative">
              <select
                value={family}
                onChange={(e) => {
                  setFamily(e.target.value);
                  setSelectedName('');
                }}
                className="block w-full rounded-xl border-gray-200 border p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-bold text-gray-700"
              >
                <option value="">▼ ファミリーを選択</option>
                {FAMILIES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">名前を選択</label>
            <div className="relative">
              
              {!family && (
                <div 
                  className="absolute inset-0 z-10" 
                  onClick={() => showAlert("先にファミリーを選択してください！")}
                />
              )}

              <select
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                disabled={!family} 
                className="block w-full rounded-xl border-gray-200 border p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-bold text-gray-700 disabled:opacity-50 disabled:bg-gray-100"
              >
                <option value="">あなたの名前を選択</option>
                {familyMembers.map((m) => (
                  <option key={m.name} value={m.name}>{m.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {family && familyMembers.length === 0 && (
               <p className="text-[10px] text-red-400 mt-1">※名簿データがありません。管理者に連絡してください。</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!family || !selectedName}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-indigo-200"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
};

// 2. Admin Panel
const AdminPanel = ({ currentEvents, onAddEvents, onTogglePublish }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [fetchedEvents, setFetchedEvents] = useState([]);
  const [selectedEventIds, setSelectedEventIds] = useState(new Set());
  const [isFetching, setIsFetching] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("パスワードが違います");
    }
  };

  const fetchCalendarEvents = async () => {
    setIsFetching(true);
    try {
      const API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
      
      if (!API_KEY) {
          alert("APIキーが読み込めません。Vercelの環境変数に「VITE_GOOGLE_CALENDAR_API_KEY」が正しく設定され、再デプロイされているか確認してください。");
          setIsFetching(false);
          return;
      }

      const CALENDAR_ID = "rensyubu7294351@gmail.com";
      
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      // 当月を含めて3ヶ月間（今月、来月、再来月）取得するように変更
      const endOfThreeMonths = new Date(now.getFullYear(), now.getMonth() + 3, 0, 23, 59, 59);

      const timeMin = startOfToday.toISOString();
      const timeMax = endOfThreeMonths.toISOString();

      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("取得失敗");
      
      const data = await response.json();
      console.log("★★Googleから届いた生データ★★:", data.items); 

      const targetColorIds = ['1', '5', '6'];
      
      const currentIds = new Set(currentEvents.map(e => e.id));

      const newCandidates = (data.items || [])
        .filter(event => {
           if (!event.colorId) return true;
           return targetColorIds.includes(event.colorId);
        })
        .map(event => {
          const startObj = new Date(event.start.dateTime || event.start.date);
          
          const yyyy = startObj.getFullYear();
          const mm = String(startObj.getMonth() + 1).padStart(2, '0');
          const dd = String(startObj.getDate()).padStart(2, '0');
          const dateStr = `${yyyy}-${mm}-${dd}`;
          
          let timeStr = '終日';
          if (event.start.dateTime) {
            const startH = String(startObj.getHours()).padStart(2, '0');
            const startM = String(startObj.getMinutes()).padStart(2, '0');
            const endObj = new Date(event.end.dateTime || event.end.date);
            const endH = String(endObj.getHours()).padStart(2, '0');
            const endM = String(endObj.getMinutes()).padStart(2, '0');
            timeStr = `${startH}:${startM}-${endH}:${endM}`;
          }

          return {
            id: event.id,
            title: event.summary || 'タイトルなし',
            date: dateStr,
            time: timeStr,
            location: event.location || '未定'
          };
        });

      setFetchedEvents(newCandidates);
      
      const newIds = new Set(newCandidates.map(e => e.id));
      setSelectedEventIds(newIds);

    } catch (error) {
      console.error(error);
      alert('カレンダーの読み込みに失敗しました。APIキーなどを確認してください。');
    } finally {
      setIsFetching(false);
    }
  };

  const toggleSelect = (id) => {
    const newSet = new Set(selectedEventIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedEventIds(newSet);
  };

  const handleImport = () => {
    const eventsToAdd = fetchedEvents.filter(e => selectedEventIds.has(e.id));
    if (eventsToAdd.length === 0) return;
    onAddEvents(eventsToAdd);
    setFetchedEvents([]);
    setSelectedEventIds(new Set());
  };

  const handleSelectAll = () => {
    const allIds = new Set(fetchedEvents.map(e => e.id));
    setSelectedEventIds(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedEventIds(new Set());
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm text-center">
          <div className="bg-gray-100 p-3 rounded-full w-14 h-14 mx-auto flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-gray-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">管理者認証</h2>
          <form onSubmit={handleLogin} className="mt-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="パスワード"
            />
            <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all">
              認証する
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              カレンダー取込
            </h2>
            <p className="text-xs text-gray-500 mt-1">Googleカレンダーから予定を取得します</p>
          </div>
          <button 
            onClick={fetchCalendarEvents}
            disabled={isFetching}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-3 rounded-xl hover:bg-indigo-100 font-bold text-sm transition disabled:opacity-50 active:scale-[0.98]"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? '取得中...' : '予定を取得'}
          </button>
        </div>

        {fetchedEvents.length > 0 ? (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 text-xs font-bold text-gray-500 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span>候補一覧</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={handleSelectAll}
                      className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-indigo-50 text-indigo-600 transition shadow-sm"
                    >
                      全選択
                    </button>
                    <button 
                      onClick={handleDeselectAll}
                      className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-500 transition shadow-sm"
                    >
                      全解除
                    </button>
                  </div>
                </div>
                <span>{selectedEventIds.size}件選択</span>
              </div>
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {fetchedEvents.map(event => {
                  const { dayStr, colorClass } = getDayInfo(event.date);
                  const isExisting = currentEvents.some(ce => ce.id === event.id);
                  return (
                    <div key={event.id} className="p-4 hover:bg-gray-50 flex items-start gap-3 transition active:bg-gray-100" onClick={() => toggleSelect(event.id)}>
                      <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedEventIds.has(event.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                        {selectedEventIds.has(event.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${colorClass} font-bold`}>{event.date} {dayStr}</span>
                          <span className="font-bold text-gray-800 text-sm">{event.time}</span>
                          {isExisting && <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded ml-2">更新</span>}
                        </div>
                        <div className="font-bold text-gray-800 text-sm">{event.title}</div>
                        <div className="text-xs text-gray-500 font-medium mt-0.5">{event.location}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button 
              onClick={handleImport}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Plus className="w-5 h-5" />
              選択した予定を追加/更新
            </button>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-sm">
            {isFetching ? 'カレンダーを確認中...' : '新しい予定を取り込んでください'}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 text-sm">公開中の日程</h3>
        </div>
        <div className="space-y-2">
          {currentEvents.length === 0 ? (
            <p className="text-gray-400 text-sm">予定はまだありません</p>
          ) : (
            currentEvents.map(event => {
              const { dayStr, colorClass } = getDayInfo(event.date);
              const isPublished = event.isPublished !== false;
              return (
                <div key={event.id} className="p-3 border border-gray-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-sm bg-gray-50/50 gap-2">
                  <div>
                    <span className={`inline-block mr-2 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold ${colorClass}`}>
                      {event.date} {dayStr}
                    </span>
                    <span className="font-bold text-gray-800 text-xs sm:text-sm">{event.title}</span>
                  </div>
                  <button 
                    onClick={() => onTogglePublish(event.id)}
                    className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full whitespace-nowrap self-start sm:self-center font-bold transition active:scale-95 border ${
                      isPublished 
                        ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' 
                        : 'bg-gray-200 text-gray-500 border-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {isPublished ? '公開中' : '非公開'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// 3. Status Badge
const StatusBadge = ({ status }) => {
  const config = STATUS_OPTIONS[status] || STATUS_OPTIONS.undecided;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold border ${config.color} whitespace-nowrap`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

// 4. Main Dashboard
const Dashboard = ({ user, events, allData, onUpdateStatus, onUpdateComment, onBatchUpdate, onLogout, onAddEvents, onTogglePublish }) => {
  const [activeTab, setActiveTab] = useState('input');
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState('ALL');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedEventIds, setSelectedEventIds] = useState(new Set());
  const [batchStatus, setBatchStatus] = useState('absent');
  const [batchComment, setBatchComment] = useState('');

const visibleEvents = useMemo(() => {
    // 確実な日本時間 (JST) で今日の日付文字列 (YYYY-MM-DD) を生成する
    const jstDateString = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());
    
    // '2026/02/28' を '2026-02-28' の形式に変換
    const todayStr = jstDateString.replace(/\//g, '-');

    // 「公開中」かつ「日本時間で今日以降」の予定のみに絞り込む
    return events.filter(e => 
      e.isPublished !== false && e.date >= todayStr
    );
  }, [events]);

  const filteredUsers = useMemo(() => {
    const dataMap = allData;
    const mergedList = MEMBER_LIST.map(member => { const docId = `${member.family}_${member.name}`; return { uid: docId, ...member, ...(dataMap[docId] || {}) }; });
    let result = mergedList;
    if (selectedFamilyFilter === 'COMMENTED') result = result.filter(u => u.comments && Object.values(u.comments).some(c => c && c.trim() !== ''));
    else if (selectedFamilyFilter !== 'ALL') result = result.filter(u => u.family === selectedFamilyFilter);
    return result;
  }, [allData, selectedFamilyFilter]);

  const getFamilyResponseRate = (familyName) => {
    if (visibleEvents.length === 0) return 0;
    const targetMembers = familyName === 'ALL' ? MEMBER_LIST : MEMBER_LIST.filter(m => m.family === familyName);
    let responded = 0;
    targetMembers.forEach(m => { const d = allData[`${m.family}_${m.name}`]; if (d?.responses) visibleEvents.forEach(e => { if ((d.responses[e.id] || 'undecided') !== 'undecided') responded++; }); });
    return Math.round((responded / (targetMembers.length * visibleEvents.length)) * 100) || 0;
  };

  const getEventCounts = (eventId) => {
    let counts = { present: 0, absent: 0, late: 0, tentative: 0, undecided: 0 };
    filteredUsers.forEach(u => { const s = u.responses?.[eventId] || 'undecided'; counts[s]++; });
    return { ...counts, rate: filteredUsers.length > 0 ? Math.round(((filteredUsers.length - counts.undecided) / filteredUsers.length) * 100) : 0 };
  };

  const toggleEventSelection = (id) => {
    const newSet = new Set(selectedEventIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedEventIds(newSet);
  };

  const handleApplyBatch = async () => {
    if (selectedEventIds.size === 0) { alert("日程を選択してください"); return; }
    setIsSaving(true);
    await onBatchUpdate(Array.from(selectedEventIds), batchStatus, batchComment);
    setIsBatchModalOpen(false); 
    setSelectedEventIds(new Set()); 
    setBatchComment('');
    setIsSaving(false);
  };

  const handleDummySave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm safe-area-top">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-indigo-600 p-1.5 rounded-lg shrink-0 hidden sm:block">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg truncate">練習出欠管理アプリ</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="text-right min-w-0">
              <div className="text-[10px] sm:text-xs text-gray-500 truncate">{user.family}</div>
              <div className="text-sm sm:text-base font-bold text-indigo-700 truncate">{user.name}</div>
            </div>
            
            <button 
              onClick={onLogout}
              className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:gap-1 sm:px-3 sm:py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition shrink-0"
              title="ログアウト"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold">ログアウト</span>
            </button>
          </div>
        </div>
        
        <div className="flex border-t border-gray-100 bg-white">
          <button 
            onClick={() => setActiveTab('input')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition relative ${activeTab === 'input' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30' : 'text-gray-400 border-transparent hover:bg-gray-50'}`}
          >
            マイ出欠
            {activeTab === 'input' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full mb-1 sm:hidden"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition relative ${activeTab === 'list' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30' : 'text-gray-400 border-transparent hover:bg-gray-50'}`}
          >
            全体一覧
            {activeTab === 'list' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 rounded-full mb-1 sm:hidden"></span>}
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition relative ${activeTab === 'admin' ? 'text-gray-800 border-gray-800 bg-gray-50' : 'text-gray-400 border-transparent hover:bg-gray-50'}`}
          >
            管理者
            {activeTab === 'admin' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-800 rounded-full mb-1 sm:hidden"></span>}
          </button>
        </div>
      </header>


      <main className="max-w-4xl mx-auto w-full p-4 flex-1 pb-20 safe-area-bottom">
        
        {/* --- VIEW 1: INPUT MODE (Uses visibleEvents) --- */}
        {activeTab === 'input' && (
          <div className="space-y-4">
            {visibleEvents.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl text-gray-400 text-sm border border-dashed border-gray-200">
                現在登録されている練習予定はありません
              </div>
            )}
            
            {visibleEvents.map(event => {
              const myStatus = allData[user.uid]?.responses?.[event.id] || 'undecided';
              const { dayStr, colorClass } = getDayInfo(event.date);
              
              return (
                <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`${colorClass} text-xs font-bold px-2.5 py-1 rounded-md tracking-wide border`}>
                        {event.date} {dayStr}
                      </span>
                      <StatusBadge status={myStatus} />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-gray-800 leading-tight">{event.title}</h3>
                      <div className="text-sm font-bold text-gray-600 flex items-center gap-1.5">
                        <span className="opacity-70 text-xs tracking-wider">時間:</span>
                        {event.time}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50/50">
                    <button 
                      onClick={() => onUpdateStatus(event.id, 'present')}
                      className={`py-4 flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-bold transition active:bg-indigo-700 active:text-white ${
                        myStatus === 'present' ? 'bg-indigo-600 text-white shadow-inner' : 'text-gray-500 hover:bg-indigo-50'
                      }`}
                    >
                      <CheckCircle2 className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 ${myStatus === 'present' ? 'opacity-100' : 'opacity-40'}`} />
                      出席
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(event.id, 'late')}
                      className={`py-4 flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-bold transition active:bg-yellow-600 active:text-white ${
                        myStatus === 'late' ? 'bg-yellow-500 text-white shadow-inner' : 'text-gray-500 hover:bg-yellow-50'
                      }`}
                    >
                      <HelpCircle className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 ${myStatus === 'late' ? 'opacity-100' : 'opacity-40'}`} />
                      遅刻/早退
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(event.id, 'absent')}
                      className={`py-4 flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-bold transition active:bg-red-600 active:text-white ${
                        myStatus === 'absent' ? 'bg-red-500 text-white shadow-inner' : 'text-gray-500 hover:bg-red-50'
                      }`}
                    >
                      <XCircle className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 ${myStatus === 'absent' ? 'opacity-100' : 'opacity-40'}`} />
                      欠席
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(event.id, 'tentative')}
                      className={`py-3 sm:py-4 flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-bold transition active:bg-purple-600 active:text-white ${
                        myStatus === 'tentative' ? 'bg-purple-500 text-white shadow-inner' : 'text-gray-500 hover:bg-purple-50'
                      }`}
                    >
                      <HelpCircle className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 ${myStatus === 'tentative' ? 'opacity-100' : 'opacity-40'}`} />
                      未確定
                    </button>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${['late', 'absent', 'tentative'].includes(myStatus) ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-3 bg-indigo-50/50 border-t border-gray-100">
                      <input 
                        id={`comment-input-${event.id}`} 
                        type="text"
                        placeholder="理由を入力"
                        defaultValue={user.comments?.[event.id] || ''}
                        onBlur={(e) => onUpdateComment(event.id, e.target.value)}
                        className="w-full text-sm bg-white border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                      />
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          const val = document.getElementById(`comment-input-${event.id}`)?.value || ''; 
                          setBatchStatus(myStatus);   
                          setBatchComment(val);       
                          setIsBatchModalOpen(true);  
                          setSelectedEventIds(new Set([event.id])); 
                        }} 
                        className="mt-2 w-full py-2 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-lg border border-indigo-100 flex items-center justify-center gap-1 hover:bg-indigo-100 transition shadow-sm active:scale-95"
                      >
                        <Plus className="w-3 h-3" /> この内容を他の日にも一括反映する
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}

            {/* Dummy Floating Save Button */}
            <div className="fixed bottom-6 right-6 z-40 safe-area-bottom">
              <button
                onClick={handleDummySave}
                disabled={isSaving}
                className={`flex items-center gap-2 px-6 py-4 rounded-full font-bold shadow-lg transition-all transform active:scale-95 ${
                  isSaving 
                    ? 'bg-green-500 text-white' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <Save className="w-5 h-5" />
                <span>{isSaving ? '保存完了' : '変更を保存'}</span>
              </button>
            </div>

          </div>
        )}

        
        {isBatchModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
              
              <div className="p-6 bg-indigo-900 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">反映する日程を選択</h3>
                    <p className="text-xs text-indigo-200 mt-1">選んだすべての日程にコメントの内容を上書きします</p>
                  </div>
                  <button onClick={() => setIsBatchModalOpen(false)}><XCircle className="w-6 h-6" /></button>
                </div>
                <div className="flex gap-2">
                  <div className="bg-white/10 px-3 py-1 rounded-lg text-xs border border-white/20">状態: {STATUS_OPTIONS[batchStatus]?.label}</div>
                  <div className="bg-white/10 px-3 py-1 rounded-lg text-xs border border-white/20 truncate flex-1">理由: {batchComment || '(なし)'}</div>
                </div>
              </div>

             
              <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                <div className="grid grid-cols-3 gap-3">
                  {visibleEvents.map(event => {
                    const isSelected = selectedEventIds.has(event.id);
                    const { dayStr } = getDayInfo(event.date);
                    return (
                      <button 
                        key={event.id}
                        onClick={() => toggleEventSelection(event.id)}
                        className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center aspect-square justify-center ${
                          isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-500'
                        }`}
                      >

                        <div className="flex items-center gap-1 mb-1.5">
                          <span className="text-xs sm:text-sm font-bold">{event.date.slice(5).replace('-', '/')}</span>
                          <span className="text-[10px] font-bold">{dayStr}</span>
                        </div>
                        
                        <span className={`text-[8px] sm:text-[9px] mb-1.5 px-1 py-0.5 rounded w-full text-center truncate ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {event.time}
                        </span>
                        
                        <span 
                          className="text-[9px] sm:text-[10px] font-bold text-center leading-tight w-full"
                          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                        >
                          {event.title}
                        </span>
                        
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 bg-white text-indigo-600 rounded-full border-2 border-indigo-600 shadow-sm">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

             
              <div className="p-6 bg-white border-t grid grid-cols-2 gap-3">
                <button onClick={() => setIsBatchModalOpen(false)} className="py-3 rounded-xl font-bold bg-gray-100
