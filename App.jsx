import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
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
  authDomain: "sample-293b1.firebaseapp.com",
  projectId: "sample-293b1",
  storageBucket: "sample-293b1.firebasestorage.app",
  messagingSenderId: "814788555901",
  appId: "1:814788555901:web:60dd655faa09e4fc39ed14"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- Constants & Config ---
const FAMILIES = [
  "おせきファミリー", "けんすけファミリー", "スクラブファミリー", 
  "みやぞんファミリー", "ちーたるファミリー", "ばなファミリー", 
  "ぴーファミリー", "ぴょんファミリー", "まちゃぴファミリー", 
  "みぃファミリー", "ゆつきファミリー", "甘ドリファミリー"
];

// ★★★ メンバー名簿 ★★★
const MEMBER_LIST = [
  { family: "おせきファミリー", name: "おせき" }, { family: "おせきファミリー", name: "のん" },
  { family: "おせきファミリー", name: "ぴーじー" }, { family: "おせきファミリー", name: "れんれん" },
  { family: "おせきファミリー", name: "夜露死苦" }, { family: "おせきファミリー", name: "菅原瑛斗" },
  { family: "おせきファミリー", name: "まつこ" }, { family: "おせきファミリー", name: "おとも" },
  { family: "おせきファミリー", name: "おまゆ" }, { family: "おせきファミリー", name: "ねずみ先輩" },
  { family: "おせきファミリー", name: "そそ" }, { family: "おせきファミリー", name: "あいか" },
  { family: "けんすけファミリー", name: "健康なスケベ" }, { family: "けんすけファミリー", name: "れいす" },
  { family: "けんすけファミリー", name: "フェンネル" }, { family: "けんすけファミリー", name: "ひとかひめ" },
  { family: "けんすけファミリー", name: "やまと" }, { family: "けんすけファミリー", name: "いもかれ" },
  { family: "けんすけファミリー", name: "そうり" }, { family: "けんすけファミリー", name: "おかわり" },
  { family: "けんすけファミリー", name: "ゆきの" }, { family: "けんすけファミリー", name: "なな氏" },
  { family: "けんすけファミリー", name: "こばなな" }, { family: "けんすけファミリー", name: "かに" },
  { family: "スクラブファミリー", name: "スクラブ" }, { family: "スクラブファミリー", name: "わたけー" },
  { family: "スクラブファミリー", name: "かなん" }, { family: "スクラブファミリー", name: "なむ" },
  { family: "スクラブファミリー", name: "きくまる。" }, { family: "スクラブファミリー", name: "ほっさ" },
  { family: "スクラブファミリー", name: "あぼ" }, { family: "スクラブファミリー", name: "ひめ" },
  { family: "スクラブファミリー", name: "あらいだひなの" }, { family: "スクラブファミリー", name: "あさこ" },
  { family: "スクラブファミリー", name: "ちゃあ" }, { family: "スクラブファミリー", name: "くり" },
  { family: "みやぞんファミリー", name: "みやぞん" }, { family: "みやぞんファミリー", name: "ちょね" },
  { family: "みやぞんファミリー", name: "キャラキャラメルト" }, { family: "みやぞんファミリー", name: "そうたろう" },
  { family: "みやぞんファミリー", name: "りょう" }, { family: "みやぞんファミリー", name: "ボンバボン" },
  { family: "みやぞんファミリー", name: "ぺそ" }, { family: "みやぞんファミリー", name: "ドリー！" },
  { family: "みやぞんファミリー", name: "ジェニファー" }, { family: "みやぞんファミリー", name: "パトラッシュ" },
  { family: "みやぞんファミリー", name: "ちゃんもり" }, { family: "みやぞんファミリー", name: "鈴木ひかり" },
  { family: "ちーたるファミリー", name: "ちーたる" }, { family: "ちーたるファミリー", name: "八重" },
  { family: "ちーたるファミリー", name: "りょく" }, { family: "ちーたるファミリー", name: "とーま" },
  { family: "ちーたるファミリー", name: "めい" }, { family: "ちーたるファミリー", name: "どりー" },
  { family: "ちーたるファミリー", name: "ヤスキ" }, { family: "ちーたるファミリー", name: "ましま" },
  { family: "ちーたるファミリー", name: "じょにー" }, { family: "ちーたるファミリー", name: "まーや" },
  { family: "ちーたるファミリー", name: "ぜよ" }, { family: "ちーたるファミリー", name: "せら" },
  { family: "ばなファミリー", name: "ばな" }, { family: "ばなファミリー", name: "IC" },
  { family: "ばなファミリー", name: "きょうこ" }, { family: "ばなファミリー", name: "こーしろー" },
  { family: "ばなファミリー", name: "公太郎" }, { family: "ばなファミリー", name: "ティミー" },
  { family: "ばなファミリー", name: "ななとう" }, { family: "ばなファミリー", name: "あんな" },
  { family: "ばなファミリー", name: "ねこ" }, { family: "ばなファミリー", name: "ポメロン" },
  { family: "ばなファミリー", name: "なつ" }, { family: "ばなファミリー", name: "シオン" },
  { family: "ぴーファミリー", name: "ぴー" }, { family: "ぴーファミリー", name: "おっくん" },
  { family: "ぴーファミリー", name: "そういち" }, { family: "ぴーファミリー", name: "あべりな" },
  { family: "ぴーファミリー", name: "ながしー" }, { family: "ぴーファミリー", name: "しゅんすけ" },
  { family: "ぴーファミリー", name: "もえきゅん" }, { family: "ぴーファミリー", name: "かんな" },
  { family: "ぴーファミリー", name: "鈴木優花" }, { family: "ぴーファミリー", name: "とぅーりお" },
  { family: "ぴーファミリー", name: "かごめ" },
  { family: "ぴょんファミリー", name: "ぴょん" }, { family: "ぴょんファミリー", name: "サツカワ　レオ" },
  { family: "ぴょんファミリー", name: "さき" }, { family: "ぴょんファミリー", name: "カマンベール・ビオ" },
  { family: "ぴょんファミリー", name: "橋本太郎" }, { family: "ぴょんファミリー", name: "ももな" },
  { family: "ぴょんファミリー", name: "はまお" }, { family: "ぴょんファミリー", name: "まりあ" },
  { family: "ぴょんファミリー", name: "さら" }, { family: "ぴょんファミリー", name: "ひかり" },
  { family: "ぴょんファミリー", name: "なっち" }, { family: "ぴょんファミリー", name: "れん" },
  { family: "まちゃぴファミリー", name: "まちゃぴ" }, { family: "まちゃぴファミリー", name: "ことー" },
  { family: "まちゃぴファミリー", name: "たかゆか" }, { family: "まちゃぴファミリー", name: "超会議" },
  { family: "まちゃぴファミリー", name: "こーじ" }, { family: "まちゃぴファミリー", name: "レイバックイナバウアー" },
  { family: "まちゃぴファミリー", name: "ふうちゃん" }, { family: "まちゃぴファミリー", name: "りな" },
  { family: "まちゃぴファミリー", name: "るな" }, { family: "まちゃぴファミリー", name: "わか" },
  { family: "まちゃぴファミリー", name: "とみー" },
  { family: "みぃファミリー", name: "みぃ" }, { family: "みぃファミリー", name: "ぺちか" },
  { family: "みぃファミリー", name: "たいしょー" }, { family: "みぃファミリー", name: "いちを" },
  { family: "みぃファミリー", name: "たかてぃん" }, { family: "みぃファミリー", name: "あすみん" },
  { family: "みぃファミリー", name: "しまめい" }, { family: "みぃファミリー", name: "むらさき" },
  { family: "みぃファミリー", name: "しまこ" }, { family: "みぃファミリー", name: "こんのほのか" },
  { family: "みぃファミリー", name: "あずみ" }, { family: "みぃファミリー", name: "いもたる" },
  { family: "ゆつきファミリー", name: "ゆつき" }, { family: "ゆつきファミリー", name: "ちゅーきち" },
  { family: "ゆつきファミリー", name: "びっくりドンキー" }, { family: "ゆつきファミリー", name: "佐藤悠貴" },
  { family: "ゆつきファミリー", name: "ゆきち" }, { family: "ゆつきファミリー", name: "バンクシー" },
  { family: "ゆつきファミリー", name: "ちゃくみ" }, { family: "ゆつきファミリー", name: "ふなはら" },
  { family: "ゆつきファミリー", name: "ほっしー" }, { family: "ゆつきファミリー", name: "ぽこ" },
  { family: "ゆつきファミリー", name: "4649" }, { family: "ゆつきファミリー", name: "らび" },
  { family: "甘ドリファミリー", name: "甘どり" }, { family: "甘ドリファミリー", name: "スナ" },
  { family: "甘ドリファミリー", name: "少年" }, { family: "甘ドリファミリー", name: "みやたか" },
  { family: "甘ドリファミリー", name: "さくら" }, { family: "甘ドリファミリー", name: "アミーゴ" },
  { family: "甘ドリファミリー", name: "マロ" }, { family: "甘ドリファミリー", name: "いなげひかりこ" },
  { family: "甘ドリファミリー", name: "りーしゃん" }, { family: "甘ドリファミリー", name: "田中真菜実" },
  { family: "甘ドリファミリー", name: "ゆり" }, { family: "甘ドリファミリー", name: "みどり" },
];

const STATUS_OPTIONS = {
  present: { label: '出席', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle2 },
  absent: { label: '欠席', color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle },
  late: { label: '遅刻/早退', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: HelpCircle },
  tentative: { label: '未確定', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: HelpCircle },
  undecided: { label: '未定', color: 'bg-gray-100 text-gray-500 border-gray-200', icon: HelpCircle },
};

// 色ID定義（Googleカレンダーの色IDに対応）
const TARGET_COLORS = {
  "1": { name: "ラベンダー", class: "bg-purple-100 text-purple-700" },
  "5": { name: "バナナ", class: "bg-yellow-100 text-yellow-700" },
  "6": { name: "ミカン", class: "bg-orange-100 text-orange-700" },
  "default": { name: "既定の色", class: "bg-gray-100 text-gray-500" } 
};

const ADMIN_PASSWORD = "yosakoi"; 

// --- Helper Functions ---
const getDayInfo = (dateString) => {
  if (!dateString) return { dayStr: '', colorClass: 'bg-gray-100 text-gray-600' };
  
  const [y, m, d] = dateString.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayIndex = date.getDay(); 
  const days = ['(日)', '(月)', '(火)', '(水)', '(木)', '(金)', '(土)'];
  const dayStr = days[dayIndex];

  let colorClass = 'bg-gray-100 text-gray-600'; 
  if (dayIndex === 0) colorClass = 'bg-green-100 text-green-700 border-green-200';
  if (dayIndex === 3) colorClass = 'bg-cyan-100 text-cyan-700 border-cyan-200';
  if (dayIndex === 6) colorClass = 'bg-pink-100 text-pink-700 border-pink-200';

  return { dayStr, colorClass };
};

const LS_USER_ID_KEY = `yosakoi_app_user_id_${appId}`;

// --- Components ---

// 1. Auth Screen
const AuthScreen = ({ onLogin }) => {
  const [family, setFamily] = useState('');
  const [selectedName, setSelectedName] = useState('');

  const familyMembers = useMemo(() => {
    if (!family) return [];
    return MEMBER_LIST.filter(m => m.family === family).sort((a, b) => 0); 
  }, [family]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (family && selectedName) onLogin(family, selectedName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 safe-area-top safe-area-bottom">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border border-indigo-50">
        <div className="text-center mb-6">
          <div className="bg-indigo-600 p-4 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">よさこい出欠</h1>
          <p className="text-xs text-gray-400 mt-1">メンバー選択ログイン</p>
        </div>
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg flex gap-2 items-start text-xs text-blue-700 mb-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>あなたの所属ファミリーと名前を選んで「ログイン」を押してください。</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">所属ファミリー</label>
            <div className="relative">
              <select value={family} onChange={(e) => { setFamily(e.target.value); setSelectedName(''); }} className="block w-full rounded-xl border-gray-200 border p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-bold text-gray-700">
                <option value="">▼ ファミリーを選択</option>
                {FAMILIES.map((f) => (<option key={f} value={f}>{f}</option>))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">名前を選択</label>
            <div className="relative">
              {!family && (<div className="absolute inset-0 z-10" onClick={() => alert("先にファミリーを選択してください！")}/>)}
              <select value={selectedName} onChange={(e) => setSelectedName(e.target.value)} disabled={!family} className="block w-full rounded-xl border-gray-200 border p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-bold text-gray-700 disabled:opacity-50 disabled:bg-gray-100">
                <option value="">あなたの名前を選択</option>
                {familyMembers.map((m) => (<option key={m.name} value={m.name}>{m.name}</option>))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <button type="submit" disabled={!family || !selectedName} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-indigo-200">
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
    if (password === ADMIN_PASSWORD) setIsAuthenticated(true);
    else alert("パスワードが違います");
  };

  const fetchCalendarEvents = async () => {
    setIsFetching(true);
    try {
      const API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
      const CALENDAR_ID = "rensyubu7294351@gmail.com";
      
      if (!API_KEY) {
          alert("APIキーが読み込めません。Vercelの環境変数を確認してください。");
          setIsFetching(false);
          return;
      }

      // 期間設定：今月の1日 〜 再来月の0日（＝来月の末日）
      const now = new Date();
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59);

      const timeMin = startOfThisMonth.toISOString();
      const timeMax = endOfNextMonth.toISOString();

      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("取得失敗");
      
      const data = await response.json();
      console.log("★★Googleから届いた生データ★★:", data.items); 

      // ターゲット色ID (1:ラベンダー, 5:バナナ, 6:ミカン)
      const targetColorIds = ['1', '5', '6'];
      
      // ★修正: すべての予定を候補にする（キャンセル済み以外）
      const newCandidates = (data.items || [])
        .filter(event => event.status !== 'cancelled') 
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
            location: event.location || '未定',
            colorId: event.colorId || 'default' // 色がない場合はdefault
          };
        });

      setFetchedEvents(newCandidates);
      
      // ★修正: ターゲット色（バナナ・ミカン・ラベンダー）のみ初期チェック
      const autoSelectIds = newCandidates
        .filter(e => e.colorId !== 'default' && targetColorIds.includes(e.colorId))
        .map(e => e.id);
        
      setSelectedEventIds(new Set(autoSelectIds));

    } catch (error) {
      console.error(error);
      alert('カレンダーの読み込みに失敗しました: ' + error.message);
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

  const handleDeleteAllEvents = async () => {
    if (window.confirm("現在公開されているすべての予定を削除しますか？\n（この操作は元に戻せません）")) {
      try {
        const eventsRef = doc(db, 'artifacts', appId, 'public', 'data', 'master', 'events');
        await setDoc(eventsRef, { items: [] }); 
        alert("すべての予定を削除しました。");
      } catch (e) {
        console.error(e);
        alert("削除に失敗しました。");
      }
    }
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
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-600" />カレンダー取込</h2>
            <p className="text-xs text-gray-500 mt-1">Googleカレンダーから予定を取得します</p>
          </div>
          <button onClick={fetchCalendarEvents} disabled={isFetching} className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-3 rounded-xl hover:bg-indigo-100 font-bold text-sm transition disabled:opacity-50 active:scale-[0.98]">
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> {isFetching ? '取得中...' : '予定を取得'}
          </button>
        </div>

        {fetchedEvents.length > 0 ? (
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 text-xs font-bold text-gray-500 flex justify-between">
                <span>候補一覧</span><span>{selectedEventIds.size}件選択</span>
              </div>
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {fetchedEvents.map(event => {
                  const { dayStr, colorClass } = getDayInfo(event.date);
                  const isExisting = currentEvents.some(ce => ce.id === event.id);
                  const colorConfig = TARGET_COLORS[event.colorId] || TARGET_COLORS['default'];
                  return (
                    <div key={event.id} className="p-4 hover:bg-gray-50 flex items-start gap-3 transition active:bg-gray-100" onClick={() => toggleSelect(event.id)}>
                      <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedEventIds.has(event.id) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                        {selectedEventIds.has(event.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 items-center mb-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${colorConfig.class} font-bold`}>{colorConfig.name}</span>
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
            <button onClick={handleImport} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
              <Plus className="w-5 h-5" /> 選択した予定を追加/更新
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
          {currentEvents.length > 0 && (
            <button onClick={handleDeleteAllEvents} className="text-xs text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition active:scale-95">全件削除</button>
          )}
        </div>
        <div className="space-y-2">
          {currentEvents.length === 0 ? <p className="text-gray-400 text-sm">予定はまだありません</p> : currentEvents.map(event => {
              const { dayStr, colorClass } = getDayInfo(event.date);
              const isPublished = event.isPublished !== false;
              return (
                <div key={event.id} className="p-3 border border-gray-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-sm bg-gray-50/50 gap-2">
                  <div>
                    <span className={`inline-block mr-2 px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold ${colorClass}`}>{event.date} {dayStr}</span>
                    <span className="font-bold text-gray-800 text-xs sm:text-sm">{event.title}</span>
                  </div>
                  <button onClick={() => onTogglePublish(event.id)} className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full whitespace-nowrap self-start sm:self-center font-bold transition active:scale-95 border ${isPublished ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' : 'bg-gray-200 text-gray-500 border-gray-300 hover:bg-gray-300'}`}>
                    {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} {isPublished ? '公開中' : '非公開'}
                  </button>
                </div>
              );
            })
          }
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
      <Icon className="w-3 h-3" /> {config.label}
    </span>
  );
};

// 4. Main Dashboard
const Dashboard = ({ user, events, allData, onUpdateStatus, onUpdateComment, onLogout, onAddEvents, onTogglePublish }) => {
  const [activeTab, setActiveTab] = useState('input');
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState('ALL');
  const [isSaving, setIsSaving] = useState(false);

  const visibleEvents = useMemo(() => events.filter(e => e.isPublished !== false), [events]);

  const filteredUsers = useMemo(() => {
    let users = Object.values(allData);
    const dataMap = allData;
    const mergedList = MEMBER_LIST.map(member => {
      const docId = `${member.family}_${member.name}`;
      return { uid: docId, ...member, ...(dataMap[docId] || {}) };
    });
    let result = mergedList;
    if (selectedFamilyFilter === 'COMMENTED') {
      result = result.filter(u => u.comments && Object.values(u.comments).some(c => c && c.trim() !== ''));
    } else if (selectedFamilyFilter !== 'ALL') {
      result = result.filter(u => u.family === selectedFamilyFilter);
    }
    return result;
  }, [allData, selectedFamilyFilter]);

  const getFamilyResponseRate = (familyName) => {
    if (visibleEvents.length === 0) return 0;
    let targetMembers = familyName === 'ALL' ? MEMBER_LIST : MEMBER_LIST.filter(m => m.family === familyName);
    const totalExpected = targetMembers.length * visibleEvents.length;
    let respondedCount = 0;
    targetMembers.forEach(m => {
      const docId = `${m.family}_${m.name}`;
      const userData = allData[docId];
      if (userData && userData.responses) {
        visibleEvents.forEach(e => {
          if ((userData.responses[e.id] || 'undecided') !== 'undecided') respondedCount++;
        });
      }
    });
    return Math.round((respondedCount / totalExpected) * 100) || 0;
  };

  const getEventCounts = (eventId) => {
    let counts = { present: 0, absent: 0, late: 0, tentative: 0, undecided: 0 };
    filteredUsers.forEach(u => {
      const status = u.responses?.[eventId] || 'undecided';
      if (counts[status] !== undefined) counts[status]++;
    });
    const total = filteredUsers.length;
    const responded = total - counts.undecided;
    const rate = total > 0 ? Math.round((responded / total) * 100) : 0;
    return { ...counts, rate, total };
  };

  const handleDummySave = () => { setIsSaving(true); setTimeout(() => setIsSaving(false), 1000); };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm safe-area-top">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-indigo-600 p-1.5 rounded-lg shrink-0 hidden sm:block"><Calendar className="w-4 h-4 text-white" /></div>
            <h1 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg truncate">よさこい出欠</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="text-right min-w-0">
              <div className="text-[10px] sm:text-xs text-gray-500 truncate">{user.family}</div>
              <div className="text-sm sm:text-base font-bold text-indigo-700 truncate">{user.name}</div>
            </div>
            <button onClick={onLogout} className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:gap-1 sm:px-3 sm:py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition shrink-0" title="ログアウト">
              <LogOut className="w-4 h-4" /><span className="hidden sm:inline text-xs font-bold">ログアウト</span>
            </button>
          </div>
        </div>
        <div className="flex border-t border-gray-100 bg-white">
          {['input', 'list', 'admin'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition relative ${activeTab === t ? 'text-indigo-600 border-indigo-600 bg-indigo-50/30' : t === 'admin' ? 'text-gray-400 hover:bg-gray-50' : 'text-gray-400 hover:bg-gray-50'}`}>
              {t === 'input' ? 'マイ出欠' : t === 'list' ? '全体一覧' : '管理者'}
              {activeTab === t && <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full mb-1 sm:hidden ${t === 'admin' ? 'bg-gray-800' : 'bg-indigo-600'}`}></span>}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto w-full p-4 flex-1 pb-20 safe-area-bottom">
        {activeTab === 'input' && (
          <div className="space-y-4">
            {visibleEvents.length === 0 && <div className="text-center py-12 bg-white rounded-2xl text-gray-400 text-sm border border-dashed border-gray-200">現在登録されている練習予定はありません</div>}
            {visibleEvents.map(event => {
              const myStatus = allData[user.uid]?.responses?.[event.id] || 'undecided';
              const { dayStr, colorClass } = getDayInfo(event.date);
              return (
                <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`${colorClass} text-xs font-bold px-2.5 py-1 rounded-md tracking-wide border`}>{event.date} {dayStr}</span>
                      <StatusBadge status={myStatus} />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-gray-800 leading-tight">{event.title}</h3>
                      <div className="text-sm font-bold text-gray-600 flex items-center gap-1.5"><span className="opacity-70 text-xs tracking-wider">時間:</span>{event.time}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-gray-100 bg-gray-50/50">
                    {['present', 'late', 'absent', 'tentative'].filter(s => s !== 'tentative').concat(['tentative']).map(s => (
                      <button key={s} onClick={() => onUpdateStatus(event.id, s)} className={`py-4 flex flex-col items-center justify-center gap-1 text-xs sm:text-sm font-bold transition active:bg-indigo-700 active:text-white ${myStatus === s ? (s === 'present' ? 'bg-indigo-600 text-white shadow-inner' : s === 'late' ? 'bg-yellow-500 text-white shadow-inner' : s === 'absent' ? 'bg-red-500 text-white shadow-inner' : 'bg-purple-500 text-white shadow-inner') : 'text-gray-500 hover:bg-gray-50'}`}>
                        {s === 'present' ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" /> : s === 'late' ? <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" /> : s === 'absent' ? <XCircle className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" /> : <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5" />}
                        {s === 'present' ? '出席' : s === 'late' ? '遅刻/早退' : s === 'absent' ? '欠席' : '未確定'}
                      </button>
                    ))}
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${['late', 'absent', 'tentative'].includes(myStatus) ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-3 bg-indigo-50/50 border-t border-gray-100">
                      <input type="text" placeholder="理由や時間などを入力（任意）" defaultValue={user.comments?.[event.id] || ''} onBlur={(e) => onUpdateComment(event.id, e.target.value)} className="w-full text-sm bg-white border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" />
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="fixed bottom-6 right-6 z-40 safe-area-bottom">
              <button onClick={handleDummySave} disabled={isSaving} className={`flex items-center gap-2 px-6 py-4 rounded-full font-bold shadow-lg transition-all transform active:scale-95 ${isSaving ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                <Save className="w-5 h-5" /><span>{isSaving ? '保存完了' : '変更を保存'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="space-y-5">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
                <Filter className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
                <button onClick={() => setSelectedFamilyFilter('COMMENTED')} className={`px-3 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 flex items-center justify-center gap-1 ${selectedFamilyFilter === 'COMMENTED' ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>💬 コメントあり</button>
                <button onClick={() => setSelectedFamilyFilter('ALL')} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex flex-col items-center gap-1 ${selectedFamilyFilter === 'ALL' ? 'bg-gray-800 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}>
                  <span>全員</span><div className="flex items-center gap-1 w-full opacity-90"><div className={`w-10 h-1.5 rounded-full overflow-hidden ${selectedFamilyFilter === 'ALL' ? 'bg-gray-600' : 'bg-gray-300'}`}><div className="h-full bg-green-400 transition-all" style={{ width: `${getFamilyResponseRate('ALL')}%` }} /></div><span className="text-[8px] leading-none font-normal">{getFamilyResponseRate('ALL')}%</span></div>
                </button>
                {FAMILIES.map(fam => (
                  <button key={fam} onClick={() => setSelectedFamilyFilter(fam)} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex flex-col items-center gap-1 ${selectedFamilyFilter === fam ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}>
                    <span>{fam.replace('ファミリー', '')}</span><div className="flex items-center gap-1 w-full opacity-90"><div className={`w-10 h-1.5 rounded-full overflow-hidden ${selectedFamilyFilter === fam ? 'bg-indigo-400' : 'bg-gray-300'}`}><div className="h-full bg-green-400 transition-all" style={{ width: `${getFamilyResponseRate(fam)}%` }} /></div><span className="text-[8px] leading-none font-normal">{getFamilyResponseRate(fam)}%</span></div>
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
              <div className="flex gap-3 w-max">
                {visibleEvents.map(event => {
                  const counts = getEventCounts(event.id);
                  const { dayStr, colorClass } = getDayInfo(event.date);
                  return (
                    <div key={event.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 w-44 shrink-0">
                      <div className={`text-[10px] mb-1 font-bold inline-block px-1.5 py-0.5 rounded ${colorClass}`}>{event.date.slice(5)} {dayStr} {event.time.split('-')[0]}~</div>
                      <div className="text-xs font-bold text-gray-800 truncate mb-1.5">{event.title}</div>
                      <div className="mb-2 bg-gray-50 p-1.5 rounded-lg border border-gray-100">
                        <div className="flex justify-between text-[9px] text-gray-500 mb-1"><span>回答率</span><span className="font-bold text-indigo-600">{counts.rate}%</span></div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${counts.rate}%` }} /></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold"><span className="text-green-600">○ {counts.present}</span><span className="text-yellow-600">△ {counts.late}</span><span className="text-red-500">× {counts.absent}</span><span className="text-purple-500">？ {counts.tentative}</span></div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-3 sticky left-0 bg-gray-50 z-10 w-32 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] text-xs">名前 ({filteredUsers.length})</th>
                      {visibleEvents.map(event => {
                        const { dayStr } = getDayInfo(event.date);
                        return <th key={event.id} className="px-1 py-2 min-w-[70px] text-center font-normal border-l border-gray-100"><div className="text-[10px] text-gray-400 leading-none mb-1">{event.date.slice(5)}{dayStr}</div><div className="truncate w-[70px] mx-auto text-[10px] leading-tight">{event.title}</div></th>
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map(u => (
                      <tr key={u.uid} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-3 sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] border-r border-gray-100"><div className="font-bold text-gray-800 text-xs sm:text-sm truncate w-28">{u.name}</div><div className="text-[10px] text-gray-400 truncate w-28">{u.family.replace('ファミリー', '')}</div></td>
                        {visibleEvents.map(event => {
                          const status = u.responses?.[event.id] || 'undecided';
                          const comment = u.comments?.[event.id];
                          let symbol = '－', colorClass = 'text-gray-300';
                          if (status === 'present') { symbol = '○'; colorClass = 'text-green-600 font-bold bg-green-50/30'; }
                          if (status === 'absent') { symbol = '×'; colorClass = 'text-red-400 bg-red-50/30'; }
                          if (status === 'late') { symbol = '△'; colorClass = 'text-yellow-500 font-bold bg-yellow-50/30'; }
                          if (status === 'tentative') { symbol = '？'; colorClass = 'text-purple-500 font-bold bg-purple-50/30'; }
                          return (
                            <td key={`${u.uid}-${event.id}`} className={`px-1 py-2 text-center border-l border-gray-100 ${colorClass} ${comment ? 'cursor-pointer active:opacity-50' : ''}`} onClick={() => comment && alert(`${u.name}さんのコメント：\n${comment}`)}>
                              <div className="flex flex-col items-center justify-center"><span>{symbol}</span>{comment && <span className="text-[8px] sm:text-[9px] text-gray-600 bg-white/80 px-1.5 mt-0.5 rounded border border-gray-200 truncate w-12 sm:w-16 shadow-sm">{comment}</span>}</div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && <AdminPanel currentEvents={events} onAddEvents={onAddEvents} onTogglePublish={onTogglePublish} />}
      </main>
    </div>
  );
};

// 5. Main App Container
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState({});
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const savedUserId = localStorage.getItem(LS_USER_ID_KEY);
    const initApp = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) await signInWithCustomToken(auth, __initial_auth_token);
      else await signInAnonymously(auth);
    };
    initApp();
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const eventsRef = doc(db, 'artifacts', appId, 'public', 'data', 'master', 'events');
        const unsubscribeEvents = onSnapshot(eventsRef, (docSnap) => {
          if (docSnap.exists()) {
            const rawItems = docSnap.data().items || [];
            const items = rawItems.filter(item => item.date !== '2024-05-18' && !item.id.startsWith('evt-'));
            items.sort((a, b) => new Date(`${a.date} ${a.time.split('-')[0]}`) - new Date(`${b.date} ${b.time.split('-')[0]}`));
            setEvents(items);
          } else { setDoc(eventsRef, { items: [] }); setEvents([]); }
        });
        const dataRef = collection(db, 'artifacts', appId, 'public', 'data', 'attendance');
        const unsubscribeData = onSnapshot(dataRef, (snapshot) => {
          const data = {};
          snapshot.forEach(doc => { data[doc.id] = { uid: doc.id, ...doc.data() }; });
          setAllData(data);
          if (!user && savedUserId && data[savedUserId]) setUser({ uid: savedUserId, ...data[savedUserId] });
          setLoading(false);
        });
        return () => { unsubscribeEvents(); unsubscribeData(); };
      } else setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []); 

  const handleLogin = async (family, name) => {
    const userId = `${family}_${name}`;
    try {
      if (!allData[userId]) await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'attendance', userId), { name, family, responses: {}, updatedAt: serverTimestamp() });
      localStorage.setItem(LS_USER_ID_KEY, userId);
      setUser({ uid: userId, ...(allData[userId] || { name, family, responses: {} }) });
    } catch (e) { console.error("Error:", e); alert("ログインに失敗しました"); }
  };

  const handleUpdateStatus = async (eventId, status) => {
    if (!user) return;
    const newResponses = { ...user.responses, [eventId]: status };
    setUser({ ...user, responses: newResponses }); 
    try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'attendance', user.uid), { responses: newResponses, updatedAt: serverTimestamp() }); } catch (e) { console.error(e); }
  };

  const handleUpdateComment = async (eventId, comment) => {
    if (!user) return;
    const newComments = { ...(user.comments || {}), [eventId]: comment };
    setUser({ ...user, comments: newComments }); 
    try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'attendance', user.uid), { comments: newComments, updatedAt: serverTimestamp() }); } catch (e) { console.error(e); }
  };

  const handleTogglePublish = async (eventId) => {
    try {
      const eventsRef = doc(db, 'artifacts', appId, 'public', 'data', 'master', 'events');
      const docSnap = await getDoc(eventsRef);
      if (docSnap.exists()) {
        const items = docSnap.data().items || [];
        const updatedItems = items.map(item => item.id === eventId ? { ...item, isPublished: item.isPublished !== false ? false : true } : item);
        await updateDoc(eventsRef, { items: updatedItems });
      }
    } catch (e) { console.error(e); alert("更新に失敗しました"); }
  };

  const handleAddEvents = async (newEvents) => {
    try {
      const eventsRef = doc(db, 'artifacts', appId, 'public', 'data', 'master', 'events');
      const docSnap = await getDoc(eventsRef);
      let currentItems = docSnap.exists() ? docSnap.data().items || [] : [];
      let updatedItems = [...currentItems];
      newEvents.forEach(newEvent => {
        const index = updatedItems.findIndex(item => item.id === newEvent.id);
        if (index > -1) updatedItems[index] = { ...newEvent, isPublished: updatedItems[index].isPublished !== false };
        else updatedItems.push({ ...newEvent, isPublished: true });
      });
      await updateDoc(eventsRef, { items: updatedItems });
      alert(`${newEvents.length}件の予定を更新/追加しました`);
    } catch (e) { console.error(e); alert("失敗しました"); }
  };

  const handleLogout = () => { localStorage.removeItem(LS_USER_ID_KEY); setUser(null); };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
  if (!user) return <AuthScreen onLogin={handleLogin} />;
  return <Dashboard user={user} events={events} allData={allData} onUpdateStatus={handleUpdateStatus} onUpdateComment={handleUpdateComment} onLogout={handleLogout} onAddEvents={handleAddEvents} onTogglePublish={handleTogglePublish} />;
}
