import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, BookOpen, X, Upload, CheckCircle2, Copy, Check, MessageSquareQuote, Sun, Moon } from 'lucide-react';

// Bible Book Mapping (Tagalog and English)
const BOOK_MAP = {
  'genesis': 1, 'exodo': 2, 'exodus': 2, 'levitico': 3, 'leviticus': 3, 
  'bilang': 4, 'numbers': 4, 'deuteronomio': 5, 'deuteronomy': 5,
  'josue': 6, 'joshua': 6, 'hukom': 7, 'judges': 7, 'ruth': 8, 
  'isamuel': 9, '1samuel': 9, 'iisamuel': 10, '2samuel': 10,
  'ihari': 11, '1hari': 11, '1kings': 11, 'iihari': 12, '2hari': 12, '2kings': 12,
  'icronica': 13, '1cronica': 13, '1chronicles': 13, 'iicronica': 14, '2cronica': 14, '2chronicles': 14,
  'ezra': 15, 'nehemias': 16, 'nehemiah': 16, 'esther': 17, 'job': 18,
  'awit': 19, 'psalms': 19, 'kawikaan': 20, 'proverbs': 20,
  'eclesiastes': 21, 'ecclesiastes': 21,
  'awitngmgaawit': 22, 'songofsongs': 22,
  'isaias': 23, 'isaiah': 23, 'jeremias': 24, 'jeremiah': 24,
  'panaghoy': 25, 'lamentations': 25, 'ezekiel': 26, 'daniel': 27,
  'oseas': 28, 'hosea': 28, 'joel': 29, 'amos': 30, 'obadias': 31, 'obadiah': 31,
  'jonas': 32, 'jonah': 32, 'mikas': 33, 'micah': 33, 'nahum': 34,
  'habacuc': 35, 'habakkuk': 35, 'zefanias': 36, 'zephaniah': 36,
  'hagai': 37, 'haggai': 37, 'zacarias': 38, 'zechariah': 38, 'malakias': 39, 'malachi': 39,
  'mateo': 40, 'matthew': 40, 'marcos': 41, 'mark': 41, 'lucas': 42, 'luke': 42,
  'juan': 43, 'john': 43, 'jn': 43, 'gawa': 44, 'acts': 44, 'roma': 45, 'romans': 45,
  'icorinto': 46, '1corinto': 46, '1corinthians': 46, 'iicorinto': 47, '2corinto': 47, '2corinthians': 47,
  'galacia': 48, 'galatians': 48, 'efeso': 49, 'ephesians': 49, 'filipos': 50, 'philippians': 50,
  'colosas': 51, 'colossians': 51, 'itesalonica': 52, '1tesalonica': 52, '1thessalonians': 52,
  'iitesalonica': 53, '2tesalonica': 53, '2thessalonians': 53, 'itimoteo': 54, '1timoteo': 54, '1timothy': 54,
  'iitimoteo': 55, '2timoteo': 55, '2timothy': 55, 'tito': 56, 'titus': 56, 'filemon': 57, 'philemon': 57,
  'hebreo': 58, 'hebrews': 58, 'santiago': 59, 'james': 59,
  'ipedro': 60, '1pedro': 60, '1peter': 60, 'iipedro': 61, '2pedro': 61, '2peter': 61,
  'ijuan': 62, '1juan': 62, '1john': 62, 'iijuan': 63, '2juan': 63, '2john': 63, 'iiijuan': 64, '3juan': 64, '3john': 64,
  'judas': 65, 'jude': 65, 'apocalipsis': 66, 'revelation': 66
};

// Tagalog Priority Keys for Prefix Resolution
const TAGALOG_PRIORITY_KEYS = [
  'genesis', 'exodo', 'levitico', 'bilang', 'deuteronomio', 'josue', 'hukom', 'ruth',
  'isamuel', 'iisamuel', 'ihari', 'iihari', 'icronica', 'iicronica', 'ezra', 'nehemias',
  'esther', 'job', 'awit', 'kawikaan', 'eclesiastes', 'awitngmgaawit', 'isaias', 'jeremias',
  'panaghoy', 'ezekiel', 'daniel', 'oseas', 'joel', 'amos', 'obadias', 'jonas', 'mikas',
  'nahum', 'habacuc', 'zefanias', 'hagai', 'zacarias', 'malakias', 'mateo', 'marcos',
  'lucas', 'juan', 'gawa', 'roma', 'icorinto', 'iicorinto', 'galacia', 'efeso', 'filipos',
  'colosas', 'itesalonica', 'iitesalonica', 'itimoteo', 'iitimoteo', 'tito', 'filemon',
  'hebreo', 'santiago', 'ipedro', 'iipedro', 'ijuan', 'iijuan', 'iiijuan', 'judas', 'apocalipsis'
];

const DISPLAY_NAMES = {
  1: 'GENESIS', 2: 'EXODO', 3: 'LEVITICO', 4: 'BILANG', 5: 'DEUTERONOMIO', 6: 'JOSUE', 7: 'HUKOM', 8: 'RUTH',
  9: 'I SAMUEL', 10: 'II SAMUEL', 11: 'I HARI', 12: 'II HARI', 13: 'I CRONICA', 14: 'II CRONICA', 15: 'EZRA', 16: 'NEHEMIAS',
  17: 'ESTHER', 18: 'JOB', 19: 'AWIT', 20: 'KAWIKAAN', 21: 'ECLESIASTES', 22: 'AWIT NG MGA AWIT',
  23: 'ISAIAS', 24: 'JEREMIAS', 25: 'PANAGHOY', 26: 'EZEKIEL', 27: 'DANIEL', 28: 'OSEAS', 29: 'JOEL', 30: 'AMOS',
  31: 'OBADIAS', 32: 'JONAS', 33: 'MIKAS', 34: 'NAHUM', 35: 'HABACUC', 36: 'ZEFANIAS', 37: 'HAGAI', 38: 'ZACARIAS', 39: 'MALAKIAS',
  40: 'MATEO', 41: 'MARCOS', 42: 'LUCAS', 43: 'JUAN', 44: 'GAWA', 45: 'ROMA', 46: 'I CORINTO', 47: 'II CORINTO',
  48: 'GALACIA', 49: 'EFESO', 50: 'FILIPOS', 51: 'COLOSAS', 52: 'I TESALONICA', 53: 'II TESALONICA', 54: 'I TIMOTEO',
  55: 'II TIMOTEO', 56: 'TITO', 57: 'FILEMON', 58: 'HEBREO', 59: 'SANTIAGO', 60: 'I PEDRO', 61: 'II PEDRO', 62: 'I JUAN',
  63: 'II JUAN', 64: 'III JUAN', 65: 'JUDAS', 66: 'APOCALIPSIS'
};

const escapeHTML = (str) => {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  })[m]);
};

const resolveBookId = (input) => {
  const cleanInput = input.toLowerCase().replace(/\s/g, '');
  if (BOOK_MAP[cleanInput]) return BOOK_MAP[cleanInput];
  const tMatch = TAGALOG_PRIORITY_KEYS.find(k => k.startsWith(cleanInput));
  if (tMatch) return BOOK_MAP[tMatch];
  const allKeys = Object.keys(BOOK_MAP);
  const aMatch = allKeys.find(k => k.startsWith(cleanInput));
  if (aMatch) return BOOK_MAP[aMatch];
  return cleanInput;
};

const VERSE_REGEX = /\b(?:(?:[1-3]|I{1,3})\s?)?[A-Za-z]{2,}\.?\s?\d{1,3}[:.]\d{1,3}(?:-\d{1,3})?\b/g;

const App = () => {
  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const [theme, setTheme] = useState(getSystemTheme());
  
  const [content, setContent] = useState(
    "Juan 3:16 sapagka't gayon na lamang ang pagsinta ng Dios sa sanglibutan...\n" +
    "Bil 1.1 At ang Panginoon ay nagsalita kay Moises...\n" +
    "Fili 1.1 Kay Pablo at kay Timoteo...\n" +
    "Apoc 1:1 Ang pahayag ni Jesucristo..."
  );
  
  const [bibleData, setBibleData] = useState({});
  const [csvStatus, setCsvStatus] = useState({ loaded: false, count: 0 });
  const [copied, setCopied] = useState(false);
  const [notesCopied, setNotesCopied] = useState(false);
  
  const [tooltip, setTooltip] = useState({ 
    visible: false, 
    expanded: false,
    x: 0, 
    y: 0, 
    width: 0,
    height: 0,
    ref: '',
    compactFullRef: '',
    fullRef: '',
    verseList: [],
    lineEndIndex: -1,
    currentLineText: '',
    matchIndex: -1
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [interactionOffset, setInteractionOffset] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const editorRef = useRef(null);
  const backdropRef = useRef(null);
  const fileInputRef = useRef(null);
  const tooltipRef = useRef(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleScroll = (e) => {
    if (backdropRef.current) {
      backdropRef.current.scrollTop = e.target.scrollTop;
      backdropRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split(/\r?\n/);
      const newBibleData = {};
      let count = 0;

      for (let i = 1; i < rows.length; i++) {
        if (!rows[i].trim()) continue;
        const cols = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (cols.length >= 4) {
          const book = cols[0].trim().replace(/"/g, '');
          const chapter = cols[1].trim();
          const verseNo = cols[2].trim();
          const verseText = cols.slice(3).join(',').trim().replace(/^"|"$/g, '');
          const bookId = resolveBookId(book);
          const key = `${bookId}-${chapter}-${verseNo}`;
          newBibleData[key] = verseText;
          count++;
        }
      }
      setBibleData(newBibleData);
      setCsvStatus({ loaded: true, count });
    };
    reader.readAsText(file);
  };

  const parseVerseRef = (ref) => {
    const match = ref.match(/^((?:(?:[1-3]|I{1,3})\s?)?[A-Za-z]+)\.?\s?(\d+)[:.](\d+)(?:-(\d+))?$/i);
    if (!match) return null;
    const bookInput = match[1];
    const chapter = match[2];
    const verseStart = match[3];
    const verseEnd = match[4]; 
    const bookId = resolveBookId(bookInput);
    return { bookId, chapter, verseStart, verseEnd };
  };

  const getVerseList = useCallback((refString) => {
    const parsed = parseVerseRef(refString);
    if (!parsed) return [];
    if (!csvStatus.loaded) return [{ v: 0, title: '', text: "CSV Required" }];
    const list = [];
    const bookName = DISPLAY_NAMES[parsed.bookId] || parsed.bookId;
    const start = parseInt(parsed.verseStart);
    const end = parsed.verseEnd ? parseInt(parsed.verseEnd) : start;
    const safeEnd = Math.min(end, start + 50); 
    for (let v = start; v <= safeEnd; v++) {
      const key = `${parsed.bookId}-${parsed.chapter}-${v}`;
      list.push({
        v,
        title: `${bookName} ${parsed.chapter}:${v}`,
        text: bibleData[key] || "Verse not found."
      });
    }
    return list;
  }, [bibleData, csvStatus.loaded]);

  const handleInteraction = (e) => {
    if (isDragging || isResizing) return;
    const textarea = editorRef.current;
    if (!textarea) return;
    const pos = textarea.selectionStart;
    const text = textarea.value;
    VERSE_REGEX.lastIndex = 0;
    let match;
    let foundMatch = null;
    let matchIdx = 0;
    let currentMatchIdx = -1;
    let lineEnd = -1;
    let lineText = '';
    while ((match = VERSE_REGEX.exec(text)) !== null) {
      if (pos >= match.index && pos <= match.index + match[0].length + 1) {
        foundMatch = match[0];
        currentMatchIdx = matchIdx;
        const prevNewline = text.lastIndexOf('\n', match.index);
        const nextNewline = text.indexOf('\n', match.index);
        const lineStart = prevNewline === -1 ? 0 : prevNewline + 1;
        lineEnd = nextNewline === -1 ? text.length : nextNewline;
        lineText = text.substring(lineStart, lineEnd);
        break;
      }
      matchIdx++;
    }

    if (foundMatch) {
      const parsed = parseVerseRef(foundMatch);
      let compactFull = foundMatch;
      if (parsed) {
        const book = DISPLAY_NAMES[parsed.bookId] || parsed.bookId;
        const base = `${book} ${parsed.chapter}:${parsed.verseStart}`;
        compactFull = parsed.verseEnd ? `${base}-${parsed.verseEnd}` : base;
      }

      // Compact tooltip size
      const tooltipWidth = 180;
      const tooltipHeight = 44;
      let spawnX, spawnY;

      if (backdropRef.current) {
        const highlightSpans = backdropRef.current.querySelectorAll('.verse-highlight');
        const targetSpan = highlightSpans[currentMatchIdx];
        if (targetSpan) {
          const rect = targetSpan.getBoundingClientRect();
          spawnX = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          spawnY = rect.top - tooltipHeight - 8;
        } else {
          spawnX = window.innerWidth / 2 - tooltipWidth / 2;
          spawnY = window.innerHeight / 2 - tooltipHeight / 2;
        }
      }

      const screenPadding = 10;
      if (spawnX < screenPadding) spawnX = screenPadding;
      if (spawnX + tooltipWidth > window.innerWidth - screenPadding) spawnX = window.innerWidth - tooltipWidth - screenPadding;
      if (spawnY < screenPadding) spawnY = spawnY + tooltipHeight + 28;

      setTooltip({
        visible: true, 
        expanded: false, // Reset to compact mode on any new click
        x: spawnX, 
        y: spawnY, 
        ref: foundMatch, 
        compactFullRef: compactFull,
        lineEndIndex: lineEnd, 
        currentLineText: lineText, 
        matchIndex: currentMatchIdx,
        verseList: [],
        fullRef: '',
        width: 0,
        height: 0
      });
    } else {
      if (!e.target.closest('.bible-tooltip')) {
        setTooltip(prev => ({ ...prev, visible: false, expanded: false, matchIndex: -1 }));
      }
    }
  };

  const expandVerse = (e) => {
    if (e) e.stopPropagation();
    const list = getVerseList(tooltip.ref);
    const parsed = parseVerseRef(tooltip.ref);
    let fullRefLabel = tooltip.ref;
    if (parsed) {
      const bookName = DISPLAY_NAMES[parsed.bookId] || parsed.bookId;
      const baseLabel = `${bookName} ${parsed.chapter}:${parsed.verseStart}`;
      fullRefLabel = parsed.verseEnd ? `${baseLabel}-${parsed.verseEnd}` : baseLabel;
    }
    
    const expWidth = 368; 
    const expHeight = 280; 
    const margin = 12; 
    const padding = 10;
    let newX = tooltip.x;
    let newY = tooltip.y;

    if (backdropRef.current && tooltip.matchIndex !== -1) {
        const highlightSpans = backdropRef.current.querySelectorAll('.verse-highlight');
        const targetSpan = highlightSpans[tooltip.matchIndex];
        if (targetSpan) {
            const rect = targetSpan.getBoundingClientRect();
            newY = rect.bottom + margin;
            newX = rect.left + (rect.width / 2) - (expWidth / 2);
        }
    }

    if (newX < padding) newX = padding;
    if (newX + expWidth > window.innerWidth - padding) newX = window.innerWidth - expWidth - padding;
    if (newY + expHeight > window.innerHeight - padding) {
        newY = Math.max(padding, window.innerHeight - expHeight - padding);
    }

    setTooltip(prev => ({ 
      ...prev, 
      expanded: true, 
      verseList: list, 
      fullRef: fullRefLabel,
      x: newX, 
      y: newY, 
      width: expWidth, 
      height: expHeight 
    }));
  };

  useEffect(() => {
    if (tooltip.visible && tooltip.expanded) {
      const newList = getVerseList(tooltip.ref);
      setTooltip(prev => ({ ...prev, verseList: newList }));
    }
  }, [bibleData, getVerseList, tooltip.visible, tooltip.expanded, tooltip.ref]);

  const startDrag = (e) => {
    if (!tooltip.expanded) return;
    if (e.target.closest('button')) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    setIsDragging(true);
    setInteractionOffset({ x: clientX - tooltip.x, y: clientY - tooltip.y });
  };

  const startResize = (e) => {
    e.stopPropagation();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    setIsResizing(true);
    setInteractionOffset({ x: clientX, y: clientY, w: tooltip.width, h: tooltip.height });
  };

  const handleCopyNotes = () => {
    const textArea = document.createElement("textarea");
    textArea.value = content;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setNotesCopied(true);
      setTimeout(() => setNotesCopied(false), 2000);
    } catch (err) {}
    document.body.removeChild(textArea);
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    const selection = window.getSelection().toString();
    const textToCopy = selection || tooltip.verseList.map(v => `${v.title}\n${v.text}`).join('\n\n');
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
    document.body.removeChild(textArea);
  };

  const handleQuote = (e) => {
    e.stopPropagation();
    if (!csvStatus.loaded) return;
    const selection = window.getSelection().toString();
    let quoteText = selection || tooltip.verseList.map(v => v.text).join(' ');
    let leadingSpace = " ";
    if (tooltip.lineEndIndex > 0) {
      const charBeforeLineEnd = content[tooltip.lineEndIndex - 1];
      if (charBeforeLineEnd === " " || charBeforeLineEnd === "\n") leadingSpace = "";
    } else if (tooltip.lineEndIndex === 0) {
      leadingSpace = "";
    }
    const formattedQuote = `${leadingSpace}"${quoteText.trim()}"`;
    if (tooltip.lineEndIndex !== -1) {
      const newContent = content.slice(0, tooltip.lineEndIndex) + formattedQuote + content.slice(tooltip.lineEndIndex);
      setContent(newContent);
      const prevNewline = newContent.lastIndexOf('\n', tooltip.lineEndIndex);
      const nextNewline = newContent.indexOf('\n', tooltip.lineEndIndex + formattedQuote.length);
      const lineStart = prevNewline === -1 ? 0 : prevNewline + 1;
      const lineEnd = nextNewline === -1 ? newContent.length : nextNewline;
      setTooltip(prev => ({
        ...prev, lineEndIndex: lineEnd, currentLineText: newContent.substring(lineStart, lineEnd)
      }));
    }
  };

  useEffect(() => {
    let animationFrame;
    const onMove = (e) => {
      if (!isDragging && !isResizing) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      animationFrame = requestAnimationFrame(() => {
        if (isDragging) {
          const width = tooltip.width || 368;
          const height = tooltip.height || 280;
          const padding = 5;
          let nx = clientX - interactionOffset.x;
          let ny = clientY - interactionOffset.y;
          if (nx < padding) nx = padding;
          if (nx + width > window.innerWidth - padding) nx = window.innerWidth - width - padding;
          if (ny < padding) ny = padding;
          if (ny + height > window.innerHeight - padding) ny = window.innerHeight - height - padding;
          setTooltip(prev => ({ ...prev, x: nx, y: ny }));
        } else if (isResizing) {
          const deltaX = clientX - interactionOffset.x;
          const deltaY = clientY - interactionOffset.y;
          const newW = Math.max(240, interactionOffset.w + deltaX);
          const newH = Math.max(180, interactionOffset.h + deltaY);
          const finalW = Math.min(newW, window.innerWidth - tooltip.x - 10);
          const finalH = Math.min(newH, window.innerHeight - tooltip.y - 10);
          setTooltip(prev => ({ ...prev, width: finalW, height: finalH }));
        }
      });
      if (e.cancelable) e.preventDefault();
    };
    const onEnd = () => { setIsDragging(false); setIsResizing(false); };
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', onMove, { passive: false });
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      cancelAnimationFrame(animationFrame);
    };
  }, [isDragging, isResizing, interactionOffset, tooltip.x, tooltip.y, tooltip.width, tooltip.height]);

  const getHighlightedHTML = (text) => {
    VERSE_REGEX.lastIndex = 0;
    let lastIndex = 0;
    const parts = [];
    let match;
    while ((match = VERSE_REGEX.exec(text)) !== null) {
      parts.push(escapeHTML(text.substring(lastIndex, match.index)));
      parts.push(`<span class="verse-highlight">${escapeHTML(match[0])}</span>`);
      lastIndex = VERSE_REGEX.lastIndex;
    }
    parts.push(escapeHTML(text.substring(lastIndex)));
    return parts.join('') + (text.endsWith('\n') ? ' ' : '');
  };

  const renderVerseContent = (verseText) => {
    if (!tooltip.currentLineText) return verseText;
    const quoteRegex = /["“”]([^"“”]+)["“”]/g;
    const existingQuotes = [...tooltip.currentLineText.matchAll(quoteRegex)].map(m => m[1]);
    if (existingQuotes.length === 0) return verseText;
    const significantQuotes = existingQuotes.filter(q => q.trim() && q !== verseText && verseText.includes(q));
    if (significantQuotes.length === 0) return verseText;
    const uniqueQuotes = [...new Set(significantQuotes)].sort((a, b) => b.length - a.length);
    const escaped = uniqueQuotes.map(q => q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const combinedRegex = new RegExp(`(${escaped.join('|')})`, 'g');
    const parts = verseText.split(combinedRegex);
    return parts.map((part, i) => {
      if (uniqueQuotes.includes(part)) {
        return <span key={i} className={`${isDark ? 'text-sky-400' : 'text-sky-600'}`}>{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className={`min-h-screen p-2 md:p-4 font-sans transition-colors duration-300 overflow-hidden select-none flex flex-col ${isDark ? 'bg-black text-white' : 'bg-white text-slate-900'}`}>
      <style>{`
        .editor-container { position: relative; flex-grow: 1; min-height: 0; width: 100%; background: transparent; }
        .editor-shared { font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 16px; line-height: 1.6; padding: 16px; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word; font-variant-ligatures: none; box-sizing: border-box; width: 100%; height: 100%; margin: 0; border: none; outline: none; display: block; overflow-y: scroll; overflow-x: hidden; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeSpeed; appearance: none; border-radius: 0; }
        .verse-highlight { font-weight: bold; background-color: ${isDark ? 'rgba(99, 102, 241, 0.45)' : 'rgba(14, 165, 233, 0.15)'}; color: transparent; border-radius: 4px; padding: 0; margin: 0; box-shadow: 0 0 0 1px ${isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(14, 165, 233, 0.2)'}; display: inline; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? '#1e293b' : '#cbd5e1'}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        textarea { position: absolute; top: 0; left: 0; z-index: 2; background: transparent !important; color: inherit !important; caret-color: #6366f1; resize: none; -webkit-text-fill-color: ${isDark ? 'white' : '#0f172a'}; }
        .backdrop { position: absolute; top: 0; left: 0; z-index: 1; background: transparent; pointer-events: none; color: transparent; -webkit-text-fill-color: transparent; }
        .expanded-content-area { user-select: text !important; cursor: text; }
      `}</style>

      <div className="max-w-5xl mx-auto h-full flex flex-col w-full">
        <header className="flex flex-row items-center justify-between px-1 pt-1 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded shadow-md">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Bible Journal</h1>
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={toggleTheme}
              className={`p-1.5 rounded-lg border transition-all active:scale-95 shadow-sm ${isDark ? 'bg-slate-900 border-slate-800 text-yellow-400 hover:border-yellow-400/50' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500'}`}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            <button onClick={() => fileInputRef.current.click()}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-sm ${csvStatus.loaded ? (isDark ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800/50' : 'bg-emerald-50 text-emerald-700 border-emerald-200') : (isDark ? 'bg-slate-900 text-white border-slate-800 hover:border-indigo-500' : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-500')}`}>
              {csvStatus.loaded ? <CheckCircle2 size={14} /> : <Upload size={14} />}
              <span className="hidden sm:inline">{csvStatus.loaded ? `${csvStatus.count} Verses` : 'Upload CSV'}</span>
            </button>
            <button onClick={handleCopyNotes}
              className={`p-1.5 rounded-lg border shadow-sm transition-all active:scale-95 ${isDark ? 'bg-slate-900 text-white border-slate-800 hover:border-indigo-500' : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-500'}`}
              title="Copy Journal Content">
              {notesCopied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
            </button>
          </div>
        </header>

        <div className={`h-px w-full mb-2 flex-shrink-0 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

        <div className="editor-container h-[calc(100vh-120px)]">
          <div ref={backdropRef} aria-hidden="true" className="editor-shared backdrop custom-scrollbar" dangerouslySetInnerHTML={{ __html: getHighlightedHTML(content) }} />
          <textarea ref={editorRef} value={content} onChange={(e) => setContent(e.target.value)} onScroll={handleScroll} onKeyUp={handleInteraction} onClick={handleInteraction} className="editor-shared custom-scrollbar" spellCheck="false" />
        </div>

        {tooltip.visible && (
          <div ref={tooltipRef}
            style={{ position: 'fixed', left: `${tooltip.x}px`, top: `${tooltip.y}px`, width: tooltip.expanded ? `${tooltip.width}px` : 'auto', height: tooltip.expanded ? `${tooltip.height}px` : 'auto', cursor: isDragging ? 'grabbing' : (isResizing ? 'nwse-resize' : 'default'), touchAction: 'none', zIndex: 1000 }}
            className={`bible-tooltip backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border ${isDark ? 'bg-slate-900/90 text-slate-100 border-slate-800/50' : 'bg-white/95 text-slate-900 border-slate-200'} ${!isDragging && !isResizing ? 'transition-all duration-150' : ''}`}
          >
            {!tooltip.expanded ? (
              <div className="flex items-center gap-3 py-2 pl-4 pr-2">
                <button onClick={expandVerse} className="text-sm font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-400 transition-colors">{tooltip.compactFullRef}</button>
                <button onClick={expandVerse} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black py-1.5 px-3 rounded-md flex items-center gap-1 active:scale-95 transition-all"><Search size={14} /> SHOW</button>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div onMouseDown={startDrag} onTouchStart={startDrag} className={`px-4 py-2 flex justify-between items-center cursor-grab active:cursor-grabbing border-b select-none flex-shrink-0 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-100/50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 pointer-events-none">
                    <span className="text-lg font-black text-indigo-500 uppercase tracking-tight">{tooltip.fullRef}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={handleQuote} disabled={!csvStatus.loaded} className={`p-2 rounded-lg transition-all active:scale-90 ${csvStatus.loaded ? (isDark ? 'hover:bg-slate-700 text-white' : 'hover:bg-slate-200 text-slate-700') : 'opacity-20 cursor-not-allowed'}`} title="Quote">
                      <MessageSquareQuote size={20} />
                    </button>
                    <button onClick={handleCopy} disabled={!csvStatus.loaded} className={`p-2 rounded-lg transition-all active:scale-90 ${csvStatus.loaded ? (isDark ? 'hover:bg-slate-700 text-white' : 'hover:bg-slate-200 text-slate-700') : 'opacity-20 cursor-not-allowed'}`} title="Copy">
                      {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                    </button>
                    <button onClick={() => setTooltip(prev => ({ ...prev, visible: false, expanded: false }))} className={`transition-colors p-2 rounded-lg ${isDark ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200'}`}><X size={22} /></button>
                  </div>
                </div>
                <div className={`expanded-content-area flex-grow overflow-y-auto custom-scrollbar ${isDark ? 'bg-slate-950/20' : 'bg-slate-50/50'}`}>
                  {!csvStatus.loaded ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-5">
                      <div className={`p-4 rounded-full border ${isDark ? 'bg-slate-900/40 border-slate-800/50' : 'bg-slate-100 border-slate-200'}`}><Upload size={32} className="text-indigo-500 opacity-50" /></div>
                      <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm font-medium leading-relaxed`}>CSV data required to view scripture contents.</p>
                      <button onClick={() => fileInputRef.current.click()} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-xl transition-all active:scale-95">Upload Bible CSV</button>
                    </div>
                  ) : (
                    <div className={`divide-y ${isDark ? 'divide-slate-800/40' : 'divide-slate-200'}`}>
                      {tooltip.verseList.map((item, idx) => (
                        <div key={idx} className={`p-4 ${isDark ? 'bg-slate-900/10 hover:bg-slate-800/20' : 'bg-white/10 hover:bg-slate-100/50'}`}>
                          {tooltip.verseList.length > 1 && (
                            <span className={`text-base font-bold block uppercase tracking-tight mb-2 text-indigo-500 opacity-80`}>{item.title}</span>
                          )}
                          <p className={`text-[17px] leading-relaxed font-serif select-text ${isDark ? 'text-white' : 'text-slate-800'}`} onContextMenu={(e) => e.preventDefault()}>{renderVerseContent(item.text)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div onMouseDown={startResize} onTouchStart={startResize} className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-end justify-end p-1 group">
                  <div className={`w-2.5 h-2.5 rounded-full transition-colors shadow-sm ${isDark ? 'bg-slate-700 group-hover:bg-indigo-500' : 'bg-slate-300 group-hover:bg-indigo-500'}`} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;