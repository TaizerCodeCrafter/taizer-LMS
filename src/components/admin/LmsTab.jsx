import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  BookOpen,
  FileCheck,
  Share2,
  Settings,
  Plus,
  Trash2,
  CreditCard,
  Save,
  AlertCircle,
  Lock,
  Unlock,
  Calendar,
  Clock,
  Award,
  FileText,
  UploadCloud,
  Eye,
  CheckCircle2,
  Edit3,
  Users,
  Paperclip,
  Check,
  X,
  Loader2,
  Code,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  ExternalLink,
  Sparkles,
  XCircle,
  Play,
  Gift,
  Video,
  MessageSquare,
  Pin,
  ThumbsUp,
  Heart,
  HelpCircle,
  Send,
  Globe
} from "lucide-react";
import {
  DEFAULT_LOGIN_FORM_RULES,
  DEFAULT_CARD_UI_RULES,
  buildPreviewDocument,
  evaluateWebCode
} from "../../utils/codeEvaluator";
import { showAppConfirm, showAppToast } from "../GlobalAlert";

const LmsTab = ({
  lmsSubTab,
  setLmsSubTab,
  selectedSessionGrade,
  setSelectedSessionGrade,
  availableGrades = [],
  courseSettings = {},
  setCourseSettings = () => {},
  bankDetails = {},
  setBankDetails = () => {},
  onSaveCourseSettings,
  onSaveBankDetails,
  syncToBackend,
  showNotification
}) => {
  const gradeList = availableGrades.length > 0 ? availableGrades : ["Crypto Basic", "Order Flow"];
  // Generic state for Materials and Referrals
  const safeJson = (raw, fallback = {}) => {
    try {
      if (!raw || raw === "null" || raw === "undefined") return fallback;
      const parsed = JSON.parse(raw);
      return parsed !== null && typeof parsed !== "undefined" ? parsed : fallback;
    } catch {
      return fallback;
    }
  };

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  // Helper for YouTube Thumbnails
  const getYouTubeThumbnail = (rawUrl) => {
    if (!rawUrl) return null;
    const url = String(rawUrl).trim();
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("watch?v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0];
    }
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  };

  // Referral Management State
  const [referralConfig, setReferralConfig] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lmsReferralConfig") || '{"active":true,"rewardAmount":"Rs. 500 Discount","rewardDesc":"Earn Rs. 500 fee discount for every friend who registers and enrolls in class.","noticeSi":"ඔබගේ මිතුරන්ට Taizer LMS වෙත ආරාධනා කර පාඨමාලා ගාස්තු වට්ටම් දිනාගන්න!"}');
    } catch {
      return { active: true, rewardAmount: "Rs. 500 Discount", rewardDesc: "Earn Rs. 500 fee discount for every friend who registers and enrolls in class.", noticeSi: "ඔබගේ මිතුරන්ට Taizer LMS වෙත ආරාධනා කර පාඨමාලා ගාස්තු වට්ටම් දිනාගන්න!" };
    }
  });
  const [isAddPartnerLinkOpen, setIsAddPartnerLinkOpen] = useState(false);
  const [partnerLinkForm, setPartnerLinkForm] = useState({
    title: "",
    url: "",
    category: "Study Community",
    description: ""
  });
  const [claimedReferrals, setClaimedReferrals] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lmsClaimedReferrals") || "{}");
    } catch {
      return {};
    }
  });

  // Keep referralConfig in sync when refreshed or loaded
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = JSON.parse(localStorage.getItem("lmsReferralConfig") || "null");
        if (saved) setReferralConfig(saved);
      } catch (e) {}
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Handler for saving referral program configuration
  const handleSaveReferralConfig = async (e) => {
    if (e) e.preventDefault();
    localStorage.setItem("lmsReferralConfig", JSON.stringify(referralConfig));
    window.dispatchEvent(new Event("storage"));
    if (syncToBackend) await syncToBackend("lmsReferralConfig", referralConfig);
    if (showNotification) showNotification("Settings Saved", "Referral program settings saved & published to students", "success");
  };

  // Handler for adding a partner / resource referral link
  const handleAddPartnerLink = (e) => {
    e.preventDefault();
    if (!partnerLinkForm.title.trim() || !partnerLinkForm.url.trim()) {
      if (showNotification) showNotification("Required Fields", "Please enter title and link URL", "error");
      return;
    }
    const allRefs = JSON.parse(localStorage.getItem("lmsReferrals") || "{}");
    if (!allRefs[selectedSessionGrade]) allRefs[selectedSessionGrade] = [];
    allRefs[selectedSessionGrade].unshift({
      id: Date.now(),
      title: partnerLinkForm.title.trim(),
      url: partnerLinkForm.url.trim(),
      category: partnerLinkForm.category || "Study Community",
      description: partnerLinkForm.description?.trim() || "",
      date: new Date().toLocaleDateString('en-CA')
    });
    localStorage.setItem("lmsReferrals", JSON.stringify(allRefs));
    window.dispatchEvent(new Event("storage"));
    if (syncToBackend) syncToBackend("lmsReferrals", allRefs);
    if (showNotification) showNotification("Link Added", `${partnerLinkForm.title} added for ${selectedSessionGrade}`, "success");
    setPartnerLinkForm({ title: "", url: "", category: "Study Community", description: "" });
    setIsAddPartnerLinkOpen(false);
  };

  // Handler for deleting a partner referral link
  const handleDeletePartnerLink = (idx) => {
    showAppConfirm({
      title: "Delete Community Link?",
      message: "Are you sure you want to delete this community/partner link?",
      confirmText: "Delete Link",
      type: "danger",
      onConfirm: () => {
        const allRefs = JSON.parse(localStorage.getItem("lmsReferrals") || "{}");
        if (!allRefs[selectedSessionGrade]) return;
        allRefs[selectedSessionGrade].splice(idx, 1);
        localStorage.setItem("lmsReferrals", JSON.stringify(allRefs));
        window.dispatchEvent(new Event("storage"));
        if (syncToBackend) syncToBackend("lmsReferrals", allRefs);
        if (showNotification) showNotification("Deleted", "Partner referral link removed", "info");
      }
    });
  };

  // Handler for toggling claim status on student discount
  const handleToggleRewardClaimed = (claimKey) => {
    const updated = { ...claimedReferrals, [claimKey]: !claimedReferrals[claimKey] };
    setClaimedReferrals(updated);
    localStorage.setItem("lmsClaimedReferrals", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    if (syncToBackend) syncToBackend("lmsClaimedReferrals", updated);
    if (showNotification) showNotification("Reward Updated", "Referral reward status toggled", "success");
  };

  // Live Class Recordings State
  const [isAddRecordingOpen, setIsAddRecordingOpen] = useState(false);
  const [recordingSourceMode, setRecordingSourceMode] = useState("url"); // "url" | "upload"
  const [isUploadingRecordingVideo, setIsUploadingRecordingVideo] = useState(false);
  const [recordingUploadStatus, setRecordingUploadStatus] = useState("");
  const [recordingFileName, setRecordingFileName] = useState("");
  const [recordingForm, setRecordingForm] = useState({
    title: "",
    videoUrl: "",
    date: new Date().toLocaleDateString('en-CA'),
    duration: "1h 30m"
  });

  // Study Materials State
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [materialSourceMode, setMaterialSourceMode] = useState("url"); // "url" | "upload"
  const [isUploadingMaterialFile, setIsUploadingMaterialFile] = useState(false);
  const [materialUploadStatus, setMaterialUploadStatus] = useState("");
  const [materialFileName, setMaterialFileName] = useState("");
  const [materialForm, setMaterialForm] = useState({
    title: "",
    videoUrl: "",
    category: "Tute Paper",
    date: new Date().toLocaleDateString('en-CA')
  });

  const handleCloseRecordingModal = () => {
    setIsAddRecordingOpen(false);
    setRecordingSourceMode("url");
    setRecordingFileName("");
    setRecordingUploadStatus("");
    setIsUploadingRecordingVideo(false);
    setRecordingForm({ title: "", videoUrl: "", date: new Date().toLocaleDateString('en-CA'), duration: "1h 30m" });
  };

  const handleCloseMaterialModal = () => {
    setIsAddMaterialOpen(false);
    setMaterialSourceMode("url");
    setMaterialFileName("");
    setMaterialUploadStatus("");
    setIsUploadingMaterialFile(false);
    setMaterialForm({ title: "", videoUrl: "", category: "Tute Paper", date: new Date().toLocaleDateString('en-CA') });
  };

  // --- RECORDING VIDEO FILE UPLOAD (COMPUTER / BROWSER) ---
  const handleRecordingVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/") && !/\.(mp4|webm|mov|mkv|avi|ogv)$/i.test(file.name)) {
      if (showNotification) showNotification("Invalid File", "Please select a valid video file (.mp4, .webm, .mov, etc.)", "error");
      return;
    }

    if (file.size > 250 * 1024 * 1024) {
      if (showNotification) showNotification("File Too Large", "Video file size must be less than 250MB.", "error");
      return;
    }

    try {
      setIsUploadingRecordingVideo(true);
      setRecordingUploadStatus("Processing video file...");
      setRecordingFileName(file.name);

      // Local preview URL
      const localBlobUrl = URL.createObjectURL(file);
      setRecordingForm((prev) => ({ ...prev, videoUrl: localBlobUrl }));

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          setRecordingUploadStatus("Saving video to server...");
          const res = await fetch("http://localhost:5000/api/upload-video", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              videoData: event.target.result,
              fileName: file.name
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              setRecordingForm((prev) => ({ ...prev, videoUrl: data.url }));
              setRecordingUploadStatus("Video uploaded successfully! ✓");
              if (showNotification) showNotification("Upload Complete", "Video attached successfully!", "success");
            }
          } else {
            setRecordingUploadStatus("Attached locally (preview ready)");
          }
        } catch (apiErr) {
          console.warn("Backend video upload fallback:", apiErr);
          setRecordingUploadStatus("Attached locally (preview ready)");
        } finally {
          setIsUploadingRecordingVideo(false);
          setTimeout(() => setRecordingUploadStatus(""), 4000);
        }
      };

      reader.onerror = () => {
        if (showNotification) showNotification("Read Error", "Failed to read video file.", "error");
        setIsUploadingRecordingVideo(false);
        setRecordingUploadStatus("");
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      if (showNotification) showNotification("Upload Error", err.message || "Failed to process video", "error");
      setIsUploadingRecordingVideo(false);
      setRecordingUploadStatus("");
    }
  };

  // --- MATERIAL FILE UPLOAD (PDF / DOC / TUTE) ---
  const handleMaterialFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingMaterialFile(true);
      setMaterialUploadStatus("Uploading document to server...");
      setMaterialFileName(file.name);

      const localBlobUrl = URL.createObjectURL(file);
      setMaterialForm(prev => ({ ...prev, videoUrl: localBlobUrl }));

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const res = await fetch("http://localhost:5000/api/upload-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileData: event.target.result,
              fileName: file.name,
              fileType: file.type
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              setMaterialForm(prev => ({ ...prev, videoUrl: data.url }));
              setMaterialUploadStatus("Document uploaded successfully! ✓");
              if (showNotification) showNotification("Upload Complete", "Document uploaded successfully", "success");
            }
          } else {
            setMaterialUploadStatus("Saved locally");
          }
        } catch (apiErr) {
          console.warn("Backend material upload fallback:", apiErr);
          setMaterialUploadStatus("Saved locally");
        } finally {
          setIsUploadingMaterialFile(false);
          setTimeout(() => setMaterialUploadStatus(""), 4000);
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploadingMaterialFile(false);
      setMaterialUploadStatus("");
    }
  };

  // --- RECORDING HANDLERS ---
  const handleAddRecording = (e) => {
    e.preventDefault();
    if (!recordingForm.title.trim() || !recordingForm.videoUrl.trim()) {
      if (showNotification) showNotification("Required Fields", "Please enter title and select/enter video (URL or upload file)", "error");
      return;
    }
    try {
      const allRecs = JSON.parse(localStorage.getItem("lmsLiveRecordings") || "{}");
      if (!allRecs[selectedSessionGrade]) allRecs[selectedSessionGrade] = [];
      allRecs[selectedSessionGrade].unshift({
        id: "rec-" + Date.now(),
        title: recordingForm.title.trim(),
        videoUrl: recordingForm.videoUrl.trim(),
        fileName: recordingFileName || "",
        date: recordingForm.date || new Date().toLocaleDateString('en-CA'),
        duration: recordingForm.duration || "Full Session"
      });
      localStorage.setItem("lmsLiveRecordings", JSON.stringify(allRecs));
      window.dispatchEvent(new Event("storage"));
      if (syncToBackend) syncToBackend("lmsLiveRecordings", allRecs);
      if (showNotification) showNotification("Recording Added", `${recordingForm.title} successfully added for ${selectedSessionGrade}`, "success");
      handleCloseRecordingModal();
    } catch (saveErr) {
      console.error("Save recording error:", saveErr);
      if (showNotification) showNotification("Storage Full", "Failed to save recording. Please check storage quota.", "error");
    }
  };

  const handleDeleteRecording = (idx) => {
    showAppConfirm({
      title: "Delete Recording?",
      message: "Are you sure you want to delete this class recording?",
      confirmText: "Delete Recording",
      type: "danger",
      onConfirm: () => {
        const allRecs = JSON.parse(localStorage.getItem("lmsLiveRecordings") || "{}");
        if (!allRecs[selectedSessionGrade]) return;
        allRecs[selectedSessionGrade].splice(idx, 1);
        localStorage.setItem("lmsLiveRecordings", JSON.stringify(allRecs));
        window.dispatchEvent(new Event("storage"));
        if (syncToBackend) syncToBackend("lmsLiveRecordings", allRecs);
        if (showNotification) showNotification("Deleted", "Recording removed successfully", "info");
      }
    });
  };

  // --- MATERIAL HANDLERS ---
  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (!materialForm.title.trim() || !materialForm.videoUrl.trim()) {
      if (showNotification) showNotification("Required Fields", "Please enter title and file/download link", "error");
      return;
    }
    try {
      const allMats = JSON.parse(localStorage.getItem("lmsMaterials") || "{}");
      if (!allMats[selectedSessionGrade]) allMats[selectedSessionGrade] = [];
      allMats[selectedSessionGrade].unshift({
        id: "mat-" + Date.now(),
        title: materialForm.title.trim(),
        videoUrl: materialForm.videoUrl.trim(),
        fileName: materialFileName || "",
        category: materialForm.category || "Study Material",
        date: materialForm.date || new Date().toLocaleDateString('en-CA')
      });
      localStorage.setItem("lmsMaterials", JSON.stringify(allMats));
      window.dispatchEvent(new Event("storage"));
      if (syncToBackend) syncToBackend("lmsMaterials", allMats);
      if (showNotification) showNotification("Material Added", `${materialForm.title} successfully added for ${selectedSessionGrade}`, "success");
      handleCloseMaterialModal();
    } catch (saveErr) {
      console.error("Save material error:", saveErr);
      if (showNotification) showNotification("Storage Full", "Failed to save material.", "error");
    }
  };

  const handleDeleteMaterial = (idx) => {
    showAppConfirm({
      title: "Delete Study Material?",
      message: "Are you sure you want to delete this study document/tute?",
      confirmText: "Delete Material",
      type: "danger",
      onConfirm: () => {
        const allMats = JSON.parse(localStorage.getItem("lmsMaterials") || "{}");
        if (!allMats[selectedSessionGrade]) return;
        allMats[selectedSessionGrade].splice(idx, 1);
        localStorage.setItem("lmsMaterials", JSON.stringify(allMats));
        window.dispatchEvent(new Event("storage"));
        if (syncToBackend) syncToBackend("lmsMaterials", allMats);
        if (showNotification) showNotification("Deleted", "Study Material removed successfully", "info");
      }
    });
  };


  // Assignments State
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [fileUploadStatus, setFileUploadStatus] = useState("");
  const [assignmentForm, setAssignmentForm] = useState({
    title: "",
    titleSi: "",
    desc: "",
    dueDate: "",
    timeLimit: "60 Mins",
    totalMarks: 100,
    fileUrl: "",
    fileName: "",
    locked: false,
    tasks: []
  });

  // Task / Question Designer State
  const [designingAssignment, setDesigningAssignment] = useState(null);
  const [currentTasks, setCurrentTasks] = useState([]);
  const [newTaskType, setNewTaskType] = useState("mcq");
  const [solutionTab, setSolutionTab] = useState("html");

  // Submissions Viewer State
  const [viewingAssignmentSubmissions, setViewingAssignmentSubmissions] = useState(null);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [gradingState, setGradingState] = useState({});

  // Dedicated Submissions & Grading Hub State (100+ Students)
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [filterAssignment, setFilterAssignment] = useState("all");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "pending" | "graded"
  const [submissionSearch, setSubmissionSearch] = useState("");
  const [viewingStudentProfile, setViewingStudentProfile] = useState(null);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradingTaskScores, setGradingTaskScores] = useState({});


  // Discussions Management State
  const [adminDiscussions, setAdminDiscussions] = useState([]);
  const [isAddDiscussionOpen, setIsAddDiscussionOpen] = useState(false);
  const [discussionForm, setDiscussionForm] = useState({
    title: "",
    titleSi: "",
    question: "",
    grade: "All",
    category: "Theory",
    tags: "",
    pinned: true
  });
  const [adminTopicReplies, setAdminTopicReplies] = useState({});
  const [submittingDiscussionReply, setSubmittingDiscussionReply] = useState({});

  const fetchAdminDiscussions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/discussions");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAdminDiscussions(data);
          localStorage.setItem("lmsDiscussionsData", JSON.stringify(data));
          return;
        }
      }
    } catch (e) {}
    try {
      const cached = localStorage.getItem("lmsDiscussionsData");
      if (cached) setAdminDiscussions(JSON.parse(cached));
    } catch (e) {}
  };

  useEffect(() => {
    if (lmsSubTab === "Discussions") {
      fetchAdminDiscussions();
      const interval = setInterval(fetchAdminDiscussions, 4000);
      return () => clearInterval(interval);
    }
  }, [lmsSubTab]);

  const handleSaveNewDiscussion = async (e) => {
    e.preventDefault();
    if (!discussionForm.title.trim() || !discussionForm.question.trim()) {
      if (showNotification) showNotification("Required Fields", "Please provide both title and question", "error");
      return;
    }

    const tagsArr = discussionForm.tags
      ? discussionForm.tags.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const newTopic = {
      _id: "top_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      title: discussionForm.title.trim(),
      titleSi: discussionForm.titleSi.trim(),
      question: discussionForm.question.trim(),
      grade: discussionForm.grade || "All",
      category: discussionForm.category || "Theory",
      authorName: "Kavinda Sir (Lead Lecturer)",
      authorRole: "teacher",
      tags: tagsArr,
      pinned: Boolean(discussionForm.pinned),
      comments: [],
      createdAt: new Date().toISOString()
    };

    setAdminDiscussions((prev) => {
      const updated = [newTopic, ...prev];
      localStorage.setItem("lmsDiscussionsData", JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch("http://localhost:5000/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTopic)
      });
    } catch (err) {
      console.warn("Could not sync discussion to server:", err.message);
    }

    if (showNotification) {
      showNotification("Topic Published", "Discussion topic published to students", "success");
    }
    setDiscussionForm({
      title: "",
      titleSi: "",
      question: "",
      grade: "All",
      category: "Theory",
      tags: "",
      pinned: true
    });
    setIsAddDiscussionOpen(false);
  };

  const handleDeleteDiscussion = (topicId) => {
    showAppConfirm({
      title: "Delete Discussion Topic?",
      message: "Are you sure you want to delete this discussion question and all answers?",
      confirmText: "Delete Topic",
      type: "danger",
      onConfirm: async () => {
        setAdminDiscussions((prev) => {
          const updated = prev.filter((t) => (t._id || t.id) !== topicId);
          localStorage.setItem("lmsDiscussionsData", JSON.stringify(updated));
          return updated;
        });
        try {
          await fetch("http://localhost:5000/api/discussions/" + topicId, { method: "DELETE" });
        } catch (e) {}
        if (showNotification) showNotification("Deleted", "Discussion topic removed", "info");
      }
    });
  };

  const handleToggleVerifyComment = async (topicId, commentId) => {
    setAdminDiscussions((prev) => {
      const updated = prev.map((t) => {
        if ((t._id || t.id) === topicId) {
          const updatedComments = (t.comments || []).map((c) => {
            if (c.id === commentId) {
              return { ...c, isVerifiedAnswer: !c.isVerifiedAnswer };
            }
            return c;
          });
          return { ...t, comments: updatedComments };
        }
        return t;
      });
      localStorage.setItem("lmsDiscussionsData", JSON.stringify(updated));
      return updated;
    });

    try {
      await fetch("http://localhost:5000/api/discussions/" + topicId + "/verify-comment/" + commentId, {
        method: "PUT"
      });
    } catch (e) {}
    if (showNotification) showNotification("Verification Updated", "Verified Answer status toggled", "success");
  };

  const handleDeleteTopicComment = (topicId, commentId) => {
    showAppConfirm({
      title: "Delete Student Answer?",
      message: "Are you sure you want to delete this student answer?",
      confirmText: "Delete Answer",
      type: "danger",
      onConfirm: async () => {
        setAdminDiscussions((prev) => {
          const updated = prev.map((t) => {
            if ((t._id || t.id) === topicId) {
              return {
                ...t,
                comments: (t.comments || []).filter((c) => c.id !== commentId)
              };
            }
            return t;
          });
          localStorage.setItem("lmsDiscussionsData", JSON.stringify(updated));
          return updated;
        });
        try {
          await fetch("http://localhost:5000/api/discussions/" + topicId + "/comments/" + commentId, {
            method: "DELETE"
          });
        } catch (e) {}
        if (showNotification) showNotification("Deleted", "Student answer removed", "info");
      }
    });
  };

  const handleAdminReplyTopic = async (topicId) => {
    const text = (adminTopicReplies[topicId] || "").trim();
    if (!text) return;

    setSubmittingDiscussionReply((prev) => ({ ...prev, [topicId]: true }));
    const newComment = {
      id: "cmt_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6),
      studentName: "Taizer Admin (Lead Mentor)",
      studentEmail: "admin@taizer.lk",
      studentPhoto: "",
      role: "teacher",
      comment: text,
      likes: 0,
      likedBy: [],
      isVerifiedAnswer: true,
      createdAt: new Date().toISOString()
    };

    setAdminDiscussions((prev) => {
      const updated = prev.map((t) => {
        if ((t._id || t.id) === topicId) {
          return {
            ...t,
            comments: [...(t.comments || []), newComment]
          };
        }
        return t;
      });
      localStorage.setItem("lmsDiscussionsData", JSON.stringify(updated));
      return updated;
    });
    setAdminTopicReplies((prev) => ({ ...prev, [topicId]: "" }));

    try {
      await fetch("http://localhost:5000/api/discussions/" + topicId + "/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: "Taizer Admin (Lead Mentor)",
          studentEmail: "admin@taizer.lk",
          studentPhoto: "",
          role: "teacher",
          comment: text
        })
      });
    } catch (e) {} finally {
      setSubmittingDiscussionReply((prev) => ({ ...prev, [topicId]: false }));
    }
  };

  const storageKey = `lms${lmsSubTab}`;
  const allData = safeJson(localStorage.getItem(storageKey), {});
  const currentGradeItems = Array.isArray(allData[selectedSessionGrade]) ? allData[selectedSessionGrade] : [];

  // Helper to sync assignments to backend
  const syncAssignments = async (updatedData) => {
    localStorage.setItem("lmsAssignments", JSON.stringify(updatedData));
    window.dispatchEvent(new Event("storage"));
    try {
      await fetch("http://localhost:5000/api/assignments/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
    } catch (err) {
      console.warn("Backend assignment sync error:", err);
    }
  };

  // --- GENERIC ITEM HANDLERS (Materials & Referrals) ---
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    const updated = { ...allData };
    if (!updated[selectedSessionGrade]) updated[selectedSessionGrade] = [];
    updated[selectedSessionGrade].push({ title: newItemTitle, id: Date.now() });
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setNewItemTitle("");
    setIsAddItemOpen(false);
    window.dispatchEvent(new Event("storage"));
  };

  const handleDeleteItem = (idx) => {
    const updated = { ...allData };
    updated[selectedSessionGrade] = (updated[selectedSessionGrade] || []).filter(
      (_, i) => i !== idx
    );
    localStorage.setItem(storageKey, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  // --- ASSIGNMENT HANDLERS ---
  const handleAssignmentFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingFile(true);
      setFileUploadStatus("Uploading document to server...");

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const res = await fetch("http://localhost:5000/api/upload-file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileData: event.target.result,
              fileName: file.name,
              fileType: file.type
            })
          });

          if (res.ok) {
            const data = await res.json();
            setAssignmentForm((prev) => ({
              ...prev,
              fileUrl: data.url,
              fileName: file.name
            }));
            setFileUploadStatus("Uploaded successfully!");
          } else {
            setAssignmentForm((prev) => ({
              ...prev,
              fileUrl: event.target.result,
              fileName: file.name
            }));
            setFileUploadStatus("Stored locally.");
          }
        } catch (apiErr) {
          setAssignmentForm((prev) => ({
            ...prev,
            fileUrl: event.target.result,
            fileName: file.name
          }));
          setFileUploadStatus("Saved to local buffer.");
        } finally {
          setIsUploadingFile(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error:", err);
      setIsUploadingFile(false);
    }
  };

  const handleSaveNewAssignment = async (e) => {
    e.preventDefault();
    if (!assignmentForm.title.trim()) return;

    const allAssignments = JSON.parse(localStorage.getItem("lmsAssignments") || "{}");
    if (!allAssignments[selectedSessionGrade]) allAssignments[selectedSessionGrade] = [];

    const newAssignment = {
      ...assignmentForm,
      id: "asg-" + Date.now(),
      grade: selectedSessionGrade,
      createdAt: new Date().toISOString()
    };

    allAssignments[selectedSessionGrade].push(newAssignment);
    await syncAssignments(allAssignments);

    setIsAddAssignmentOpen(false);
    setAssignmentForm({
      title: "",
      titleSi: "",
      desc: "",
      dueDate: "",
      timeLimit: "60 Mins",
      totalMarks: 100,
      fileUrl: "",
      fileName: "",
      locked: false,
      tasks: []
    });
    setFileUploadStatus("");
  };

  const handleToggleLockAssignment = async (idx) => {
    const allAssignments = JSON.parse(localStorage.getItem("lmsAssignments") || "{}");
    const list = allAssignments[selectedSessionGrade] || [];
    if (!list[idx]) return;

    list[idx].locked = !list[idx].locked;
    allAssignments[selectedSessionGrade] = list;
    await syncAssignments(allAssignments);
  };

  const handleDeleteAssignment = (idx) => {
    showAppConfirm({
      title: "Delete Assignment?",
      message: "Are you sure you want to delete this assignment and all associated tasks? This action cannot be undone.",
      confirmText: "Delete Assignment",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        const allAssignments = JSON.parse(localStorage.getItem("lmsAssignments") || "{}");
        const list = allAssignments[selectedSessionGrade] || [];
        allAssignments[selectedSessionGrade] = list.filter((_, i) => i !== idx);
        await syncAssignments(allAssignments);
        showAppToast("Assignment deleted", "Assignment removed successfully", "info");
      }
    });
  };

  // --- TASK / QUESTION DESIGNER ---
  const handleOpenDesigner = (assignment) => {
    setDesigningAssignment(assignment);
    setCurrentTasks(assignment.tasks || []);
  };

  const handleAddTask = () => {
    let newTask = null;
    if (newTaskType === "mcq") {
      newTask = {
        id: "task-" + Date.now(),
        type: "mcq",
        question: "New Multiple Choice Question",
        questionSi: "නව බහුවරණ ප්‍රශ්නය",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctIndex: 0,
        marks: 10,
        explanation: ""
      };
    } else if (newTaskType === "essay") {
      newTask = {
        id: "task-" + Date.now(),
        type: "essay",
        question: "Explain the theoretical concept in detail with relevant examples.",
        questionSi: "අදාළ උදාහරණ සහිතව න්‍යායාත්මක සංකල්පය පැහැදිලි කරන්න.",
        marks: 20,
        minWords: 50,
        explanation: "Key points required in student answer..."
      };
    } else if (newTaskType === "diagram") {
      newTask = {
        id: "task-" + Date.now(),
        type: "diagram",
        question: "Draw the market equilibrium curve and upload a clear photo of your diagram.",
        questionSi: "වෙළඳපල සමතුලිතතා ප්‍රස්ථාරය ඇඳ පැහැදිලි ඡායාරූපයක් හෝ PDF එකක් මෙහි upload කරන්න.",
        marks: 20,
        instructions: "Ensure axis labels (P, Q) and curves are drawn clearly with a ruler and pen."
      };
    } else if (newTaskType === "code") {
      newTask = {
        id: "task-" + Date.now(),
        type: "code",
        question: "Design a responsive Login Form with username, password, and submit button using HTML and CSS.",
        questionSi: "ලබා දී ඇති Target Preview එක අනුව HTML සහ CSS භාවිතයෙන් Login Form එකක් නිර්මාණය කරන්න.",
        marks: 20,
        language: "html_css",
        starterCode: {
          html: '<!-- Create your Login Form here -->\n<form class="login-form">\n  <h2>Student Login</h2>\n  \n</form>',
          css: '/* Style your form, inputs, and button */\n.login-form {\n  max-width: 320px;\n  margin: 20px auto;\n  padding: 20px;\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0,0,0,0.1);\n}\n',
          js: ''
        },
        solutionCode: {
          html: '<form class="login-form">\n  <h2>Student Login</h2>\n  <div class="input-group">\n    <label>Username</label>\n    <input type="text" placeholder="Enter your username" required />\n  </div>\n  <div class="input-group">\n    <label>Password</label>\n    <input type="password" placeholder="Enter your password" required />\n  </div>\n  <button type="submit">Sign In</button>\n</form>',
          css: '.login-form {\n  max-width: 320px;\n  margin: 30px auto;\n  padding: 24px;\n  background: #ffffff;\n  border: 1px solid #e2e8f0;\n  border-radius: 16px;\n  box-shadow: 0 10px 25px rgba(0,0,0,0.08);\n  font-family: sans-serif;\n}\n.login-form h2 { margin-top: 0; color: #1e293b; text-align: center; font-size: 20px; }\n.input-group { margin-bottom: 14px; }\n.input-group label { display: block; font-size: 12px; font-weight: bold; color: #64748b; margin-bottom: 4px; }\n.input-group input { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box; }\nbutton[type="submit"] { width: 100%; padding: 12px; background: #2563eb; color: #fff; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; }\nbutton[type="submit"]:hover { background: #1d4ed8; }',
          js: ''
        },
        testRules: DEFAULT_LOGIN_FORM_RULES
      };
    }

    if (newTask) {
      setCurrentTasks((prev) => [...prev, newTask]);
    }
  };

  const handleUpdateTask = (index, field, value) => {
    setCurrentTasks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDeleteTask = (index) => {
    setCurrentTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveTasks = async () => {
    if (!designingAssignment) return;

    const allAssignments = JSON.parse(localStorage.getItem("lmsAssignments") || "{}");
    const list = allAssignments[selectedSessionGrade] || [];
    const idx = list.findIndex((a) => (a.id && a.id === designingAssignment.id) || a.title === designingAssignment.title);

    if (idx !== -1) {
      list[idx].tasks = currentTasks;
      const computedMarks = currentTasks.reduce((acc, t) => acc + (Number(t.marks) || 0), 0);
      if (computedMarks > 0) {
        list[idx].totalMarks = computedMarks;
      }
      allAssignments[selectedSessionGrade] = list;
      await syncAssignments(allAssignments);
    }

    setDesigningAssignment(null);
  };

  // --- SUBMISSIONS REVIEWER ---
  const handleOpenSubmissions = async (assignment) => {
    setViewingAssignmentSubmissions(assignment);
    setIsLoadingSubmissions(true);
    try {
      const targetId = assignment.id || assignment.title;
      const res = await fetch(`http://localhost:5000/api/submissions?assignmentId=${encodeURIComponent(targetId)}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissionsList(data);
      } else {
        const allSubs = JSON.parse(localStorage.getItem("lmsSubmissions") || "[]");
        const filtered = allSubs.filter((s) => s.assignmentId === targetId || s.assignmentTitle === assignment.title);
        setSubmissionsList(filtered);
      }
    } catch (err) {
      const allSubs = JSON.parse(localStorage.getItem("lmsSubmissions") || "[]");
      const filtered = allSubs.filter((s) => s.assignmentId === (assignment.id || assignment.title) || s.assignmentTitle === assignment.title);
      setSubmissionsList(filtered);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const handleSaveGrade = async (submissionId) => {
    const grading = gradingState[submissionId];
    if (!grading) return;

    try {
      const res = await fetch(`http://localhost:5000/api/submissions/${submissionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: Number(grading.score),
          feedback: grading.feedback,
          status: "Graded"
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setSubmissionsList((prev) =>
          prev.map((s) => (s._id === submissionId ? updated : s))
        );
        if (showNotification) showNotification("Grade Saved", "Grade & feedback saved successfully!", "success");
      }
    } catch (err) {
      if (showNotification) showNotification("Saved Locally", "Grade & feedback saved locally.", "info");
    }
  };

  const fetchAllSubmissions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setAllSubmissions(data);
        localStorage.setItem("lmsSubmissions", JSON.stringify(data));
      } else {
        setAllSubmissions(JSON.parse(localStorage.getItem("lmsSubmissions") || "[]"));
      }
    } catch {
      setAllSubmissions(JSON.parse(localStorage.getItem("lmsSubmissions") || "[]"));
    }
  };

  useEffect(() => {
    fetchAllSubmissions();
  }, [lmsSubTab]);

  const getStudentInfo = (sub) => {
    const allStudents = JSON.parse(localStorage.getItem("studentRequests") || "[]");
    const found = allStudents.find(
      s => (s.email && s.email.toLowerCase() === (sub.studentEmail || "").toLowerCase()) ||
           (s.id && s.id === sub.studentId) ||
           (s.studentId && s.studentId === sub.studentId)
    );
    return found || {
      id: sub.studentId || "STU-" + (sub.studentEmail ? sub.studentEmail.split("@")[0].toUpperCase() : "101"),
      studentId: sub.studentId || "STU-" + (sub.studentEmail ? sub.studentEmail.split("@")[0].toUpperCase() : "101"),
      name: sub.studentName || "Student",
      email: sub.studentEmail || "student@example.com",
      grade: sub.grade || (gradeList[0] || "Crypto Basic"),
      subject: sub.subject || "Crypto Basic",
      phone: "Not provided",
      paymentStatus: "Approved"
    };
  };

  const handleSaveDetailedGrade = async (submissionId, finalScore, feedback, taskScores) => {
    try {
      await fetch(`http://localhost:5000/api/submissions/${submissionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: Number(finalScore),
          feedback,
          taskScores,
          status: "Graded"
        })
      });
    } catch (err) {
      console.warn("Backend save grade fallback:", err);
    }

    const updatedSubs = allSubmissions.map(s => {
      if (s._id === submissionId || (s.assignmentId === submissionId)) {
        return { ...s, score: Number(finalScore), feedback, taskScores, status: "Graded" };
      }
      return s;
    });
    setAllSubmissions(updatedSubs);
    localStorage.setItem("lmsSubmissions", JSON.stringify(updatedSubs));
    window.dispatchEvent(new Event("storage"));
    if (showNotification) {
      showNotification("Grade Published", "Grade & feedback successfully saved and published to student!", "success");
    }
    setGradingSubmission(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER & SUBTABS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0e1424]/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800/80 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              LMS Student Portal Hub
            </h2>
            <p className="text-xs text-slate-400">
              Manage study resources, interactive online assignments, referral settings, and fee configuration
            </p>
          </div>
        </div>

        {/* SUBTAB SWITCHER */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
          {[
            { id: "Recordings", label: "Live Recordings", icon: Video },
            { id: "Materials", label: "Study Materials", icon: BookOpen },
            { id: "Assignments", label: "Assignments", icon: FileCheck },
            { id: "Submissions", label: "Submissions & Grading", icon: Award },
            { id: "Discussions", label: "Discussions & Q&A", icon: MessageSquare },
            { id: "Referrals", label: "Referrals", icon: Share2 },
            { id: "Settings", label: "Portal Settings", icon: Settings }
          ].map((sub) => {
            const Icon = sub.icon;
            const isSelected = lmsSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setLmsSubTab(sub.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBTAB: SETTINGS */}
      {lmsSubTab === "Settings" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* COURSE INFORMATION */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Course Information</h3>
                <p className="text-xs text-slate-400">Default subject name and course fee</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Default Subject Name
                </label>
                <input
                  type="text"
                  value={courseSettings.subject || ""}
                  onChange={(e) =>
                    setCourseSettings({ ...courseSettings, subject: e.target.value })
                  }
                  placeholder="e.g. Crypto Basic"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Monthly Course Fee (Rs.)
                </label>
                <input
                  type="text"
                  value={courseSettings.fee || ""}
                  onChange={(e) =>
                    setCourseSettings({ ...courseSettings, fee: e.target.value })
                  }
                  placeholder="e.g. 2500"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={onSaveCourseSettings}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Course Info</span>
              </button>
            </div>
          </div>

          {/* BANK ACCOUNT DETAILS */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Bank Deposit Details</h3>
                <p className="text-xs text-slate-400">Shown to students during checkout slip upload</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankDetails.bank || ""}
                    onChange={(e) =>
                      setBankDetails({ ...bankDetails, bank: e.target.value })
                    }
                    placeholder="e.g. BOC"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={bankDetails.branch || ""}
                    onChange={(e) =>
                      setBankDetails({ ...bankDetails, branch: e.target.value })
                    }
                    placeholder="e.g. Horowpothana"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={bankDetails.holder || ""}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, holder: e.target.value })
                  }
                  placeholder="e.g. S.S.D MADUSANKA"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={bankDetails.account || ""}
                  onChange={(e) =>
                    setBankDetails({ ...bankDetails, account: e.target.value })
                  }
                  placeholder="e.g. 5630207"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-white outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={onSaveBankDetails}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Bank Details</span>
              </button>
            </div>
          </div>
        </div>
      ) : lmsSubTab === "Assignments" ? (
        /* SPECIALIZED SUBTAB: ADVANCED ONLINE ASSIGNMENTS MANAGER */
        <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-400">Curriculum Grade:</label>
              <select
                value={selectedSessionGrade}
                onChange={(e) => setSelectedSessionGrade(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-amber-400 outline-none cursor-pointer"
              >
                {gradeList.map((g) => (
                  <option key={g} value={g} className="bg-slate-900 text-slate-200">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddAssignmentOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-black text-xs shadow-lg shadow-amber-600/20 flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Assignment</span>
              </button>
            </div>
          </div>

          {/* ASSIGNMENTS LIST GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentGradeItems.map((assignment, idx) => (
              <div
                key={assignment.id || idx}
                className="p-6 rounded-2xl bg-[#131b2e] border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xl space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Assignment {idx + 1}
                    </span>
                    <button
                      onClick={() => handleToggleLockAssignment(idx)}
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        assignment.locked
                          ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}
                      title={assignment.locked ? "Locked" : "Unlocked"}
                    >
                      {assignment.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-1">{assignment.title}</h3>
                  {assignment.titleSi && (
                    <p className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-1">{assignment.titleSi}</p>
                  )}
                  {assignment.desc && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{assignment.desc}</p>
                  )}

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-2 mt-4 text-[11px] font-semibold text-slate-400">
                    {assignment.dueDate && (
                      <span className="inline-flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        {assignment.dueDate}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Clock className="w-3 h-3 text-blue-400" />
                      {assignment.timeLimit || "60 Mins"}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Award className="w-3 h-3 text-emerald-400" />
                      {assignment.totalMarks || 100} Marks
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      <FileText className="w-3 h-3 text-purple-400" />
                      {assignment.tasks?.length || 0} Questions
                    </span>
                    {assignment.fileUrl && (
                      <span className="inline-flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-teal-400">
                        <Paperclip className="w-3 h-3" />
                        PDF Attached
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDesigner(assignment)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                      title="Add or edit questions"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Questions ({assignment.tasks?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => handleOpenSubmissions(assignment)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                      title="View Student Submissions"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Submissions</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteAssignment(idx)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition-all"
                    title="Delete Assignment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {currentGradeItems.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800/60">
                <FileCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="font-bold text-sm text-slate-300">
                  No online assignments published for {selectedSessionGrade} yet.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Click "Create New Assignment" above to publish an interactive assignment with questions and marking scheme.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : lmsSubTab === "Submissions" ? (
        /* DEDICATED SUBMISSIONS & GRADING HUB (100+ STUDENTS) */
        <div className="space-y-6">
          {/* HEADER & METRICS BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0e1424]/90 border border-slate-800/80 shadow-xl space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Submissions</span>
              <p className="text-2xl font-black text-white">{allSubmissions.length}</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#0e1424]/90 border border-slate-800/80 shadow-xl space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Pending Review</span>
              <p className="text-2xl font-black text-amber-300">{allSubmissions.filter(s => s.status !== "Graded").length}</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#0e1424]/90 border border-slate-800/80 shadow-xl space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Graded & Completed</span>
              <p className="text-2xl font-black text-emerald-300">{allSubmissions.filter(s => s.status === "Graded").length}</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#0e1424]/90 border border-slate-800/80 shadow-xl space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">Avg Marks</span>
              <p className="text-2xl font-black text-cyan-300">
                {(() => {
                  const graded = allSubmissions.filter(s => s.status === "Graded" && s.score !== undefined);
                  if (graded.length === 0) return "N/A";
                  const sum = graded.reduce((acc, s) => acc + Number(s.score || 0), 0);
                  return Math.round(sum / graded.length) + " / 100";
                })()}
              </p>
            </div>
          </div>

          {/* FILTER & SEARCH CONTROLS */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by student name, email, or Student ID..."
                  value={submissionSearch}
                  onChange={(e) => setSubmissionSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              {/* Assignment Filter Dropdown */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterAssignment}
                  onChange={(e) => setFilterAssignment(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
                >
                  <option value="all">All Assignments</option>
                  {Array.from(new Set(allSubmissions.map(s => s.assignmentTitle).filter(Boolean))).map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>

                {/* Grade Filter */}
                <select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-indigo-400 outline-none"
                >
                  <option value="all">All Grades</option>
                  {gradeList.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>

                {/* Status Toggle Pills */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterStatus === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus("pending")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterStatus === "pending" ? "bg-amber-500 text-black" : "text-slate-400 hover:text-white"}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilterStatus("graded")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${filterStatus === "graded" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    Graded
                  </button>
                </div>
              </div>
            </div>

            {/* SUBMISSIONS TABLE / CARD LIST */}
            <div className="space-y-3 pt-2">
              {(() => {
                const filtered = allSubmissions.filter((sub) => {
                  if (filterAssignment !== "all" && sub.assignmentTitle !== filterAssignment && sub.assignmentId !== filterAssignment) return false;
                  if (filterGrade !== "all" && sub.grade?.toLowerCase() !== filterGrade.toLowerCase()) return false;
                  if (filterStatus === "pending" && sub.status === "Graded") return false;
                  if (filterStatus === "graded" && sub.status !== "Graded") return false;
                  if (submissionSearch.trim()) {
                    const q = submissionSearch.toLowerCase();
                    const sInfo = getStudentInfo(sub);
                    const matchName = sub.studentName?.toLowerCase().includes(q);
                    const matchEmail = sub.studentEmail?.toLowerCase().includes(q);
                    const matchId = (sInfo.studentId || "").toLowerCase().includes(q) || (sInfo.id || "").toLowerCase().includes(q);
                    if (!matchName && !matchEmail && !matchId) return false;
                  }
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-16 text-center text-slate-500 bg-slate-900/30 rounded-2xl border border-slate-800">
                      <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                      <p className="text-sm font-bold text-slate-300">No submissions found matching your filters.</p>
                      <p className="text-xs text-slate-500 mt-1">Try changing your search query or grade/assignment filter.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 gap-3">
                    {filtered.map((sub, sIdx) => {
                      const student = getStudentInfo(sub);
                      const isGraded = sub.status === "Graded";

                      return (
                        <div
                          key={sub._id || sIdx}
                          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          {/* Student & Assignment Details */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-300 text-lg shrink-0">
                              {student.name ? student.name[0].toUpperCase() : "S"}
                            </div>
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-sm font-bold text-white">{student.name}</h4>
                                <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[10px] font-bold">
                                  ID: {student.studentId || student.id}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                  {sub.grade || student.grade || (gradeList[0] || "Crypto Basic")}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-slate-300 line-clamp-1">
                                📝 {sub.assignmentTitle}
                              </p>
                              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                                <span>{sub.studentEmail}</span>
                                <span>•</span>
                                <span>Submitted: {new Date(sub.submittedAt).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Score Badge & Action Buttons */}
                          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                            {isGraded ? (
                              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black">
                                ✓ Graded: {sub.score} Marks
                              </span>
                            ) : (
                              <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold animate-pulse">
                                ⏳ Pending Review
                              </span>
                            )}

                            {/* View Student Profile Button */}
                            <button
                              onClick={() => setViewingStudentProfile(student)}
                              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700 shadow"
                              title="View Student Full Profile"
                            >
                              <User className="w-3.5 h-3.5 text-indigo-400" />
                              <span>View Profile</span>
                            </button>

                            {/* Grade & Review Answers Button */}
                            <button
                              onClick={() => {
                                setGradingSubmission(sub);
                                setGradingTaskScores(sub.taskScores || {});
                              }}
                              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>{isGraded ? "Edit Grade" : "Grade & Review"}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      ) : lmsSubTab === "Recordings" ? (
        /* DEDICATED LIVE RECORDINGS MANAGER */
        (() => {
          const allRecs = safeJson(localStorage.getItem("lmsLiveRecordings"), {});
          const recList = Array.isArray(allRecs[selectedSessionGrade]) ? allRecs[selectedSessionGrade] : [];
          return (
            <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-rose-400" />
                    <span>Live Class Recordings Manager</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload and manage Zoom recording playback videos for {selectedSessionGrade}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                    <label className="text-xs font-bold text-slate-400">Grade:</label>
                    <select
                      value={selectedSessionGrade}
                      onChange={(e) => setSelectedSessionGrade(e.target.value)}
                      className="bg-transparent text-xs font-bold text-rose-400 outline-none cursor-pointer"
                    >
                      {gradeList.map((g) => (
                        <option key={g} value={g} className="bg-slate-900 text-slate-200">
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddRecordingOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Recording</span>
                  </button>
                </div>
              </div>

              {/* RECORDINGS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recList.map((rec, idx) => {
                  const thumb = getYouTubeThumbnail(rec.videoUrl);
                  return (
                    <div
                      key={rec.id || idx}
                      className="bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg flex flex-col justify-between group"
                    >
                      <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
                        {thumb ? (
                          <img src={thumb} alt={rec.title} className="w-full h-full object-cover" />
                        ) : (
                          <Video className="w-10 h-10 text-slate-700" />
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-white text-[9px] font-bold">
                          {rec.date}
                        </span>
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-black uppercase">
                          {rec.duration || "HD"}
                        </span>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="font-bold text-white text-xs line-clamp-2">{rec.title}</h4>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{rec.videoUrl}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                          <a
                            href={rec.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                          >
                            <span>Test Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteRecording(idx)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition-all"
                            title="Delete Recording"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {recList.length === 0 && (
                <div className="py-16 text-center text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/80 space-y-2">
                  <Video className="w-10 h-10 text-slate-700 mx-auto" />
                  <p className="font-bold text-sm text-slate-400">No recordings added for {selectedSessionGrade}</p>
                  <p className="text-xs text-slate-500">Click 'Add Recording' to publish a class recording for students.</p>
                </div>
              )}
            </div>
          );
        })()
      ) : lmsSubTab === "Materials" ? (
        /* DEDICATED STUDY MATERIALS MANAGER */
        (() => {
          const allMats = safeJson(localStorage.getItem("lmsMaterials"), {});
          const matList = Array.isArray(allMats[selectedSessionGrade]) ? allMats[selectedSessionGrade] : [];
          return (
            <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <span>Study Materials & Tutes Manager</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload and manage PDF tutes, lecture notes, and study sheets for {selectedSessionGrade}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                    <label className="text-xs font-bold text-slate-400">Grade:</label>
                    <select
                      value={selectedSessionGrade}
                      onChange={(e) => setSelectedSessionGrade(e.target.value)}
                      className="bg-transparent text-xs font-bold text-blue-400 outline-none cursor-pointer"
                    >
                      {gradeList.map((g) => (
                        <option key={g} value={g} className="bg-slate-900 text-slate-200">
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddMaterialOpen(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Material</span>
                  </button>
                </div>
              </div>

              {/* MATERIALS LIST */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matList.map((mat, idx) => (
                  <div
                    key={mat.id || idx}
                    className="p-5 bg-slate-950 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-4 shadow-lg hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-xs sm:text-sm">{mat.title}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                            {mat.category || "Tute"}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span>{mat.date || "Recent"}</span>
                          <span>•</span>
                          <span className="truncate max-w-xs">{mat.videoUrl}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {mat.videoUrl && (
                        <a
                          href={mat.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold"
                          title="Open Link"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteMaterial(idx)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white transition-all"
                        title="Delete Material"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {matList.length === 0 && (
                <div className="py-16 text-center text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/80 space-y-2">
                  <BookOpen className="w-10 h-10 text-slate-700 mx-auto" />
                  <p className="font-bold text-sm text-slate-400">No study materials added for {selectedSessionGrade}</p>
                  <p className="text-xs text-slate-500">Click 'Add Material' to upload or link a tute paper for students.</p>
                </div>
              )}
            </div>
          );
        })()
      ) : lmsSubTab === "Discussions" ? (
        /* SUBTAB: DISCUSSIONS & Q&A FORUM */
        (() => {
          const filteredAdminTopics = adminDiscussions.filter(
            (t) =>
              selectedSessionGrade === "All" ||
              t.grade === "All" ||
              !t.grade ||
              t.grade === selectedSessionGrade
          );

          return (
            <div className="space-y-6 animate-fadeIn">
              {/* HEADER & ACTION */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Academic Q&A & Student Explanations</span>
                  </div>
                  <h3 className="text-xl font-black text-white">Discussions & Q&A Management</h3>
                  <p className="text-xs text-slate-400">
                    Publish discussion prompts for {selectedSessionGrade}, review student answers, and verify official solutions.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddDiscussionOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Discussion Question (නව ප්‍රශ්නයක්)</span>
                </button>
              </div>

              {/* TOPICS LIST */}
              <div className="space-y-6">
                {filteredAdminTopics.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 bg-slate-950/40 rounded-3xl border border-slate-800/80 space-y-2">
                    <MessageSquare className="w-10 h-10 text-slate-700 mx-auto" />
                    <p className="font-bold text-sm text-slate-400">No discussion questions posted for {selectedSessionGrade}</p>
                    <p className="text-xs text-slate-500">Click 'New Discussion Question' to create a question for students to answer.</p>
                  </div>
                ) : (
                  filteredAdminTopics.map((topic) => {
                    const topicId = topic._id || topic.id;
                    const comments = topic.comments || [];

                    return (
                      <div
                        key={topicId}
                        className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 p-6 shadow-2xl space-y-5"
                      >
                        {/* TOPIC HEADER */}
                        <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-800">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {topic.pinned && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                                  <Pin className="w-3 h-3" />
                                  <span>Pinned</span>
                                </span>
                              )}
                              <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-bold">
                                {topic.grade || "All Grades"}
                              </span>
                              {topic.category && (
                                <span className="px-2.5 py-0.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[10px] font-bold">
                                  {topic.category}
                                </span>
                              )}
                              <span className="text-[11px] text-slate-500">
                                {new Date(topic.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <h4 className="text-base font-black text-white">{topic.title}</h4>
                            {topic.titleSi && (
                              <h5 className="text-xs font-bold text-indigo-300">{topic.titleSi}</h5>
                            )}
                          </div>

                          <button
                            onClick={() => handleDeleteDiscussion(topicId)}
                            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete Discussion Question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* QUESTION BODY */}
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                          {topic.question}
                        </div>

                        {/* STUDENT ANSWERS */}
                        <div className="space-y-3 pt-2">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                            <span>Student Answers ({comments.length}):</span>
                            <span className="text-[11px] text-indigo-400">Click 'Verify Answer' to mark approved answers</span>
                          </div>

                          {comments.length === 0 ? (
                            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
                              No student answers submitted yet.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {comments.map((comm) => (
                                <div
                                  key={comm.id}
                                  className={`p-4 rounded-2xl border transition-all ${
                                    comm.isVerifiedAnswer
                                      ? "bg-emerald-950/20 border-emerald-500/40"
                                      : "bg-slate-900/60 border-slate-800"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xs font-bold">
                                        {comm.studentName?.charAt(0) || "S"}
                                      </div>
                                      <div>
                                        <div className="text-xs font-bold text-white flex items-center gap-2">
                                          <span>{comm.studentName}</span>
                                          {comm.role === "teacher" && (
                                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-extrabold uppercase">
                                              Teacher
                                            </span>
                                          )}
                                          {comm.isVerifiedAnswer && (
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                              <span>Verified Model Answer</span>
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                          {comm.studentEmail} • {new Date(comm.createdAt).toLocaleString()} • {comm.likes || 0} Likes
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleToggleVerifyComment(topicId, comm.id)}
                                        className={`px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                                          comm.isVerifiedAnswer
                                            ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40"
                                            : "bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30"
                                        }`}
                                      >
                                        <Award className="w-3 h-3" />
                                        <span>{comm.isVerifiedAnswer ? "Unverify" : "Verify as Best Answer"}</span>
                                      </button>
                                      <button
                                        onClick={() => handleDeleteTopicComment(topicId, comm.id)}
                                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                                        title="Delete Answer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="text-xs text-slate-300 pl-9 whitespace-pre-line leading-relaxed">
                                    {comm.comment}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* ADMIN / TEACHER ANSWER BOX */}
                        <div className="pt-3 border-t border-slate-800 space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 block">
                            Add Official Teacher Explanation / Model Answer (ගුරු භවතාගේ පිළිතුර):
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={adminTopicReplies[topicId] || ""}
                              onChange={(e) =>
                                setAdminTopicReplies((prev) => ({
                                  ...prev,
                                  [topicId]: e.target.value
                                }))
                              }
                              placeholder="Type verified teacher explanation or guidance..."
                              className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                            />
                            <button
                              disabled={
                                !adminTopicReplies[topicId]?.trim() ||
                                submittingDiscussionReply[topicId]
                              }
                              onClick={() => handleAdminReplyTopic(topicId)}
                              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 transition-all"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Submit</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })()
      ) : (
        /* SUBTAB: REFERRALS */
        (() => {
          const allRefs = safeJson(localStorage.getItem("lmsReferrals"), {});
          const partnerLinks = Array.isArray(allRefs[selectedSessionGrade]) ? allRefs[selectedSessionGrade] : [];
          
          const parsedStudents = safeJson(localStorage.getItem("studentRequests"), []);
          const allStudents = Array.isArray(parsedStudents) ? parsedStudents : [];

          // Build list of all referrals: students who were referred by someone
          const studentReferralsList = allStudents
            .filter(s => s && s.referredBy)
            .map(s => {
              const rawRef = String(s.referredBy || "").trim();
              const cleanRef = rawRef.toUpperCase().replace(/^REF-/, '');
              
              // Attempt to find referring student safely
              const referrer = allStudents.find(st => {
                if (!st) return false;
                const stId = st.studentId ? String(st.studentId).trim().toUpperCase() : "";
                const stEmailPrefix = st.email ? String(st.email).split('@')[0].trim().toUpperCase() : "";
                return (stId && stId === cleanRef) || (stEmailPrefix && stEmailPrefix === cleanRef);
              });
              const claimKey = `${s.studentId || s.id || Math.random()}_${rawRef}`;
              const isClaimed = Boolean(claimedReferrals && claimedReferrals[claimKey]);

              return {
                friendId: s.studentId || "Pending",
                friendName: s.name || "Student",
                friendEmail: s.email || "",
                friendGrade: s.grade || (gradeList[0] || "Crypto Basic"),
                friendStatus: s.status === "Approved" || s.paymentStatus === "Approved" ? "Enrolled" : (s.paymentStatus === "Uploaded" ? "Payment Under Review" : "Pending"),
                joinedDate: s.joined ? String(s.joined).split(',')[0] : "Recent",
                referrerCode: rawRef,
                referrerName: referrer?.name || ("Student ID: " + rawRef),
                referrerId: referrer?.studentId || rawRef,
                claimKey,
                isClaimed
              };
            });

          return (
            <div className="space-y-8 animate-fadeIn">
              {/* 1. REFERRAL PROGRAM SETTINGS */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">Student Referral & Reward Program Settings</h3>
                      <p className="text-xs text-slate-400">Configure incentives, reward rules, and student dashboard announcements</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400">Program Status:</span>
                    <button
                      type="button"
                      onClick={() => setReferralConfig(prev => ({ ...prev, active: !prev.active }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        referralConfig.active
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 text-slate-500 border border-slate-700"
                      }`}
                    >
                      {referralConfig.active ? "● Active (ON)" : "○ Disabled (OFF)"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Reward Amount / Offer Text
                    </label>
                    <input
                      type="text"
                      value={referralConfig.rewardAmount}
                      onChange={(e) => setReferralConfig({ ...referralConfig, rewardAmount: e.target.value })}
                      placeholder="e.g. Rs. 500 Discount per friend"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Student Announcement (Sinhala)
                    </label>
                    <input
                      type="text"
                      value={referralConfig.noticeSi}
                      onChange={(e) => setReferralConfig({ ...referralConfig, noticeSi: e.target.value })}
                      placeholder="e.g. ඔබගේ මිතුරන්ට ආරාධනා කර පන්ති ගාස්තු වට්ටම් දිනාගන්න!"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Program Terms & Description
                    </label>
                    <textarea
                      rows={2}
                      value={referralConfig.rewardDesc}
                      onChange={(e) => setReferralConfig({ ...referralConfig, rewardDesc: e.target.value })}
                      placeholder="Terms and reward conditions shown to students..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveReferralConfig}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Program Settings</span>
                  </button>
                </div>
              </div>

              {/* 2. RECOMMENDED STUDY PARTNER & RESOURCE LINKS */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-sky-400" />
                      <span>Curated Partner & Study Community Links</span>
                    </h3>
                    <p className="text-xs text-slate-400">Links displayed to students under the Referrals & Communities tab</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={selectedSessionGrade}
                      onChange={(e) => setSelectedSessionGrade(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-indigo-400 outline-none cursor-pointer"
                    >
                      {gradeList.map((g) => (
                        <option key={g} value={g} className="bg-slate-900 text-slate-200">
                          {g}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setIsAddPartnerLinkOpen(true)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Partner Link</span>
                    </button>
                  </div>
                </div>

                {partnerLinks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {partnerLinks.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 flex items-start justify-between gap-4 transition-all">
                        <div className="space-y-1.5 min-w-0">
                          <span className="px-2.5 py-0.5 rounded-md bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-black uppercase tracking-wider">
                            {item.category || "Community"}
                          </span>
                          <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                          {item.description && (
                            <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                          )}
                          <a
                            href={item.url || item.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-mono truncate"
                          >
                            <span>{item.url || item.videoUrl}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                        <button
                          onClick={() => handleDeletePartnerLink(idx)}
                          className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white flex items-center justify-center transition-all shrink-0"
                          title="Delete link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/60 border-dashed space-y-2">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-400">No partner links published for {selectedSessionGrade}</p>
                    <p className="text-[11px] text-slate-500">Click "+ Add Partner Link" above to publish community or book discount links for students.</p>
                  </div>
                )}
              </div>

              {/* 3. STUDENT REFERRALS ROSTER & DISCOUNT TRACKER */}
              <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>Student Referral Activity & Discount Tracker</span>
                    </h3>
                    <p className="text-xs text-slate-400">Live roster of students who referred friends, friend enrollment status, and reward management</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-slate-900 text-emerald-400 border border-slate-800 text-xs font-bold">
                      {studentReferralsList.length} Total Referrals
                    </span>
                  </div>
                </div>

                {studentReferralsList.length > 0 ? (
                  <div className="overflow-x-auto rounded-2xl border border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="p-3.5">Referrer Student</th>
                          <th className="p-3.5">Friend Invited</th>
                          <th className="p-3.5">Grade</th>
                          <th className="p-3.5">Joined Date</th>
                          <th className="p-3.5">Enrollment Status</th>
                          <th className="p-3.5">Reward Status</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {studentReferralsList.map((row, idx) => (
                          <tr key={idx} className="bg-slate-900/30 hover:bg-slate-800/40 transition-colors">
                            <td className="p-3.5">
                              <p className="font-bold text-white">{row.referrerName}</p>
                              <p className="font-mono text-[10px] text-indigo-400">{row.referrerId}</p>
                            </td>
                            <td className="p-3.5">
                              <p className="font-bold text-white">{row.friendName}</p>
                              <p className="font-mono text-[10px] text-slate-400">{row.friendId}</p>
                            </td>
                            <td className="p-3.5 text-slate-300">{row.friendGrade}</td>
                            <td className="p-3.5 text-slate-400 font-mono text-[10px]">{row.joinedDate}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                row.friendStatus === "Enrolled"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}>
                                {row.friendStatus}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                row.isClaimed
                                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              }`}>
                                {row.isClaimed ? "Discount Applied ✔" : "Eligible for Discount 🎁"}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => handleToggleRewardClaimed(row.claimKey)}
                                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                                  row.isClaimed
                                    ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                                }`}
                              >
                                {row.isClaimed ? "Mark Pending" : "Mark as Applied"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/60 border-dashed space-y-2">
                    <Users className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-400">No student referral registrations recorded yet</p>
                    <p className="text-[11px] text-slate-500">When new students enter a friend's referral code during registration, they will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })()
      )}

      {/* CREATE NEW DISCUSSION QUESTION MODAL */}
      {isAddDiscussionOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">Create New Discussion Topic</h3>
                <p className="text-xs text-slate-400">Post question or discussion prompt for students</p>
              </div>
              <button
                onClick={() => setIsAddDiscussionOpen(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewDiscussion} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Topic / Question Title (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elasticity of Demand & Supply Test Discussion"
                  value={discussionForm.title}
                  onChange={(e) => setDiscussionForm({ ...discussionForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Title (Sinhala Translation)</label>
                <input
                  type="text"
                  placeholder="e.g. ඉල්ලුම් හා සැපයුම් නම්‍යතාවය පිළිබඳ විභාග ප්‍රශ්න සාකච්ඡාව"
                  value={discussionForm.titleSi}
                  onChange={(e) => setDiscussionForm({ ...discussionForm, titleSi: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Target Grade</label>
                  <select
                    value={discussionForm.grade}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {["All", ...gradeList].map((g) => (
                      <option key={g} value={g}>{g === "All" ? "All Batches / Grades" : g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                  <select
                    value={discussionForm.category}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {["Theory", "Past Paper", "Model Paper", "Discussion", "General"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Detailed Question / Prompt</label>
                <textarea
                  rows={4}
                  required
                  placeholder="ප්‍රශ්නය හෝ පැහැදිලි කිරීමට අවශ්‍ය කරුණු මෙහි සටහන් කරන්න... (Type the full question prompt here)..."
                  value={discussionForm.question}
                  onChange={(e) => setDiscussionForm({ ...discussionForm, question: e.target.value })}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Market Structure, Order Flow, Candlestick Patterns"
                  value={discussionForm.tags}
                  onChange={(e) => setDiscussionForm({ ...discussionForm, tags: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pinTopic"
                  checked={discussionForm.pinned}
                  onChange={(e) => setDiscussionForm({ ...discussionForm, pinned: e.target.checked })}
                  className="rounded border-slate-800 text-indigo-600 focus:ring-0"
                />
                <label htmlFor="pinTopic" className="text-xs font-bold text-slate-300">
                  Pin this topic to the top of the forum (📌 මුදුනට Pin කරන්න)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddDiscussionOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all"
                >
                  Publish Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW ASSIGNMENT MODAL */}
      {isAddAssignmentOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">Create New Online Assignment</h3>
                <p className="text-xs text-slate-400">Publish interactive assignment for {selectedSessionGrade}</p>
              </div>
              <button
                onClick={() => setIsAddAssignmentOpen(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewAssignment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Assignment Title (English)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3 - Elasticity of Demand & Supply Test"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Sinhala Title (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 3 වන ඒකකය - ඉල්ලුමේ හා සැපයුමේ නම්‍යතාවය ඇගයීම"
                  value={assignmentForm.titleSi}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, titleSi: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description / Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Write clear instructions for students..."
                  value={assignmentForm.desc}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, desc: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-white outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Time Limit</label>
                  <input
                    type="text"
                    placeholder="e.g. 60 Mins"
                    value={assignmentForm.timeLimit}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, timeLimit: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={assignmentForm.totalMarks}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, totalMarks: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Reference PDF / Document Upload */}
              <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Attach Question Paper / Reference Document (PDF)</span>
                  {assignmentForm.fileName && (
                    <span className="text-[10px] text-emerald-400 font-semibold truncate max-w-[200px]">
                      ✓ {assignmentForm.fileName}
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all">
                    <UploadCloud className="w-4 h-4 text-amber-400" />
                    <span>Upload Document File</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={handleAssignmentFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-500">or</span>
                  <input
                    type="url"
                    placeholder="Direct PDF URL (optional)"
                    value={assignmentForm.fileUrl}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, fileUrl: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
                {fileUploadStatus && (
                  <p className="text-[11px] text-amber-400 font-medium">{fileUploadStatus}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddAssignmentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingFile}
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-black text-xs shadow-lg shadow-amber-600/20 disabled:opacity-50"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUESTIONS / TASKS BUILDER MODAL */}
      {designingAssignment && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b101e] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Questions Builder:</span>
                  <span className="text-amber-400">{designingAssignment.title}</span>
                </h3>
                <p className="text-xs text-slate-400">Design online tasks, MCQs, and essay answer prompts</p>
              </div>
              <button
                onClick={() => setDesigningAssignment(null)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Quick Add Task Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Task Type:</span>
                <select
                  value={newTaskType}
                  onChange={(e) => setNewTaskType(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none"
                >
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="essay">Written Essay / Short Answer</option>
                  <option value="diagram">Handwritten Diagram / Paper Upload</option>
                  <option value="code">💻 Web Dev & Programming Challenge</option>
                </select>
              </div>

              <button
                onClick={handleAddTask}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow flex items-center gap-2 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question / Task</span>
              </button>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
              {currentTasks.map((task, tIdx) => (
                <div
                  key={task.id || tIdx}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 relative group hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                        {tIdx + 1}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {task.type === "mcq" ? "MCQ" : task.type === "essay" ? "Written Answer" : task.type === "code" ? "Web Dev Challenge" : "Diagram Upload"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-400">Marks:</span>
                        <input
                          type="number"
                          value={task.marks || 10}
                          onChange={(e) => handleUpdateTask(tIdx, "marks", Number(e.target.value))}
                          className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-center text-amber-400 font-bold outline-none"
                        />
                      </div>
                      <button
                        onClick={() => handleDeleteTask(tIdx)}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Question in English..."
                      value={task.question || ""}
                      onChange={(e) => handleUpdateTask(tIdx, "question", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Question in Sinhala (optional)..."
                      value={task.questionSi || ""}
                      onChange={(e) => handleUpdateTask(tIdx, "questionSi", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Task Specific Details */}
                  {task.type === "mcq" && (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400">Answer Choices (Radio indicates correct choice):</p>
                      {(task.options || ["", "", "", ""]).map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${tIdx}`}
                            checked={task.correctIndex === oIdx}
                            onChange={() => handleUpdateTask(tIdx, "correctIndex", oIdx)}
                            className="text-amber-500 focus:ring-0 cursor-pointer"
                          />
                          <input
                            type="text"
                            placeholder={`Choice ${oIdx + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...(task.options || [])];
                              newOpts[oIdx] = e.target.value;
                              handleUpdateTask(tIdx, "options", newOpts);
                            }}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {task.type === "essay" && (
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 block">Teacher Marking Rubric / Key Points:</label>
                      <textarea
                        rows={2}
                        placeholder="Key concepts, definitions, or equations students should include..."
                        value={task.explanation || ""}
                        onChange={(e) => handleUpdateTask(tIdx, "explanation", e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>
                  )}

                  {task.type === "diagram" && (
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 block">Instructions for Diagram:</label>
                      <input
                        type="text"
                        placeholder="e.g. Draw shift in supply curve when production subsidy is provided."
                        value={task.instructions || ""}
                        onChange={(e) => handleUpdateTask(tIdx, "instructions", e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}
                  {task.type === "code" && (
                    <div className="pt-3 border-t border-slate-800 space-y-4">
                      {/* Language & Preset Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5" /> Web Dev Challenge Parameters
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateTask(tIdx, "testRules", DEFAULT_LOGIN_FORM_RULES);
                              if (showNotification) showNotification("Rules Applied", "Login Form auto-grading rules loaded!", "info");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-[10px] font-bold border border-indigo-500/30"
                          >
                            Use Login Form Preset
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateTask(tIdx, "testRules", DEFAULT_CARD_UI_RULES);
                              if (showNotification) showNotification("Rules Applied", "Card UI auto-grading rules loaded!", "info");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30"
                          >
                            Use Card UI Preset
                          </button>
                        </div>
                      </div>

                      {/* Reference / Model Solution Code (Hidden from students) */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" /> Reference / Model Solution Code (Secret - Never Shown to Students):
                          </label>
                          <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                            {["html", "css", "js"].map((lang) => (
                              <button
                                key={lang}
                                type="button"
                                onClick={() => setSolutionTab(lang)}
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                                  solutionTab === lang ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                                }`}
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                        </div>

                        <textarea
                          rows={6}
                          placeholder={`/* Enter reference ${solutionTab.toUpperCase()} solution code here... */`}
                          value={(task.solutionCode && task.solutionCode[solutionTab]) || ""}
                          onChange={(e) => {
                            const prevCode = task.solutionCode || { html: "", css: "", js: "" };
                            handleUpdateTask(tIdx, "solutionCode", { ...prevCode, [solutionTab]: e.target.value });
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 outline-none focus:border-indigo-500"
                        />

                        {/* Live Target Preview (What students see visually) */}
                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] font-bold text-slate-400 block mb-1">
                            Live Target Preview (This visual render is shown to students):
                          </span>
                          <iframe
                            title="Teacher Model Preview"
                            srcDoc={buildPreviewDocument(
                              task.solutionCode?.html || "",
                              task.solutionCode?.css || "",
                              task.solutionCode?.js || ""
                            )}
                            sandbox="allow-scripts"
                            className="w-full h-40 rounded-xl border border-slate-800 bg-white"
                          />
                        </div>
                      </div>

                      {/* Auto-Grading Rules List */}
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-[11px] font-bold text-emerald-400 block">
                          Automated Inspection & Detection Rules ({(task.testRules || []).length} active checks):
                        </span>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                          {(task.testRules || []).map((rule, rIdx) => (
                            <div key={rule.id || rIdx} className="flex items-center justify-between text-[11px] bg-slate-900 p-2 rounded-lg border border-slate-800">
                              <span className="text-slate-200 font-semibold">{rule.label}</span>
                              <span className="text-amber-400 font-bold">+{rule.marks || 4} Marks</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ))}

              {currentTasks.length === 0 && (
                <div className="py-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
                  <p className="text-xs font-bold text-slate-400">No questions added yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Select a question type above and click "Add Question / Task" to build your interactive assignment.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400">
                Total Questions: <span className="text-white">{currentTasks.length}</span> | Total Marks:{" "}
                <span className="text-amber-400">
                  {currentTasks.reduce((acc, t) => acc + (Number(t.marks) || 0), 0)}
                </span>
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDesigningAssignment(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTasks}
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20"
                >
                  Save Questions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSIONS REVIEWER MODAL */}
      {viewingAssignmentSubmissions && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b101e] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full space-y-6 shadow-2xl my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>Student Submissions:</span>
                  <span className="text-emerald-400">{viewingAssignmentSubmissions.title}</span>
                </h3>
                <p className="text-xs text-slate-400">Grade student answers and provide marks & feedback</p>
              </div>
              <button
                onClick={() => setViewingAssignmentSubmissions(null)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
              {isLoadingSubmissions ? (
                <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                  <p className="text-xs font-bold">Loading submissions from database...</p>
                </div>
              ) : submissionsList.length > 0 ? (
                submissionsList.map((sub, sIdx) => {
                  const currentGrade = gradingState[sub._id] || {
                    score: sub.score !== undefined ? sub.score : "",
                    feedback: sub.feedback || ""
                  };

                  return (
                    <div
                      key={sub._id || sIdx}
                      className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{sub.studentName || "Student"}</h4>
                            <span className="text-xs text-slate-400">({sub.studentEmail})</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Submitted: {new Date(sub.submittedAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              sub.status === "Graded"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {sub.status || "Submitted"}
                          </span>
                          {sub.score !== undefined && (
                            <span className="text-xs font-black text-white bg-slate-800 px-3 py-1 rounded-full">
                              Score: {sub.score} / {viewingAssignmentSubmissions.totalMarks || 100}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Submitted Answers */}
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-300">Submitted Answers:</p>
                        {viewingAssignmentSubmissions.tasks?.map((task, tIdx) => {
                          const ans = sub.answers?.[tIdx];
                          return (
                            <div key={tIdx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                              <p className="text-xs font-semibold text-slate-300">
                                Question {tIdx + 1}: {task.question}
                              </p>
                              {task.type === "mcq" ? (
                                <p className="text-xs text-indigo-300 font-bold">
                                  Selected Choice: {ans !== undefined ? `${ans + 1}. ${task.options?.[ans]}` : "Not answered"}
                                </p>
                              ) : task.type === "diagram" ? (
                                <div>
                                  {ans ? (
                                    <div className="mt-2">
                                      <img
                                        src={ans}
                                        alt="Student diagram"
                                        className="max-h-48 rounded-lg border border-slate-700 object-contain bg-black cursor-pointer"
                                        onClick={() => window.open(ans, "_blank")}
                                      />
                                      <span className="text-[10px] text-slate-500 mt-1 block">Click image to view full size</span>
                                    </div>
                                  ) : (
                                    <p className="text-xs text-slate-500 italic">No file uploaded</p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg whitespace-pre-wrap leading-relaxed">
                                  {ans || <span className="text-slate-600 italic">No answer written</span>}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Teacher Grading & Feedback Inputs */}
                      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-3 items-end">
                        <div className="w-full sm:w-32">
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Score / Marks</label>
                          <input
                            type="number"
                            placeholder="e.g. 85"
                            value={currentGrade.score}
                            onChange={(e) =>
                              setGradingState({
                                ...gradingState,
                                [sub._id]: { ...currentGrade, score: e.target.value }
                              })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-amber-400 outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="flex-1 w-full">
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Teacher Feedback / Notes</label>
                          <input
                            type="text"
                            placeholder="e.g. Well explained! Review diagram axes labels."
                            value={currentGrade.feedback}
                            onChange={(e) =>
                              setGradingState({
                                ...gradingState,
                                [sub._id]: { ...currentGrade, feedback: e.target.value }
                              })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                          />
                        </div>

                        <button
                          onClick={() => handleSaveGrade(sub._id)}
                          className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow shrink-0 flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Grade</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-16 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
                  <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-400">No students have submitted this assignment yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Once students complete their answers online, their submissions will appear here for grading.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setViewingAssignmentSubmissions(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* STUDENT FULL PROFILE MODAL */}
      {viewingStudentProfile && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0b101e] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" />
                <span>Student Academic Profile</span>
              </h3>
              <button
                onClick={() => setViewingStudentProfile(null)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Profile Card Header */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                {viewingStudentProfile.name ? viewingStudentProfile.name[0].toUpperCase() : "S"}
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">{viewingStudentProfile.name}</h4>
                <p className="text-xs font-mono text-indigo-400 font-bold">
                  Student ID: {viewingStudentProfile.studentId || viewingStudentProfile.id}
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    {viewingStudentProfile.grade || (gradeList[0] || "Crypto Basic")}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                    {viewingStudentProfile.subject || "Crypto Basic"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact & Status Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold text-[10px] uppercase">Email Address</span>
                <p className="text-slate-200 font-medium truncate">{viewingStudentProfile.email || "N/A"}</p>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold text-[10px] uppercase">Phone Number</span>
                <p className="text-slate-200 font-medium">{viewingStudentProfile.phone || "Not provided"}</p>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold text-[10px] uppercase">Enrollment & Payment</span>
                <p className="font-bold text-emerald-400">{viewingStudentProfile.paymentStatus || "Approved"}</p>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold text-[10px] uppercase">Attendance Record</span>
                <p className="text-slate-200 font-medium">
                  {viewingStudentProfile.isPresent ? "Marked Present" : "Active Student"}
                </p>
              </div>
            </div>

            {/* Student Assignment History */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Submitted Assignments History:</span>
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                {allSubmissions
                  .filter(s => s.studentEmail === viewingStudentProfile.email || s.studentName === viewingStudentProfile.name)
                  .map((sub, i) => (
                    <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-white line-clamp-1">{sub.assignmentTitle}</p>
                        <p className="text-[10px] text-slate-500">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-[11px]">
                        {sub.score !== undefined ? `${sub.score} Marks` : "Pending"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setViewingStudentProfile(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE GRADING STUDIO MODAL */}
      {gradingSubmission && (() => {
        const studentInfo = getStudentInfo(gradingSubmission);
        const allAssignments = JSON.parse(localStorage.getItem("lmsAssignments") || "{}");
        const currentGradeAssignments = allAssignments[gradingSubmission.grade] || [];
        const assignmentObj = currentGradeAssignments.find(
          a => a.id === gradingSubmission.assignmentId || a.title === gradingSubmission.assignmentTitle
        ) || {
          title: gradingSubmission.assignmentTitle,
          totalMarks: 100,
          tasks: []
        };

        const currentScore = gradingState[gradingSubmission._id]?.score !== undefined
          ? gradingState[gradingSubmission._id].score
          : (gradingSubmission.score !== undefined ? gradingSubmission.score : "");

        const currentFeedback = gradingState[gradingSubmission._id]?.feedback !== undefined
          ? gradingState[gradingSubmission._id].feedback
          : (gradingSubmission.feedback || "");

        return (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#0b101e] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full space-y-6 shadow-2xl my-8 max-h-[92vh] flex flex-col">
              {/* Studio Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-black text-[10px] uppercase tracking-wider border border-indigo-500/30">
                      Grading Studio
                    </span>
                    <h3 className="text-lg font-black text-white">{gradingSubmission.assignmentTitle}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Student: <span className="text-white font-bold">{studentInfo.name}</span> (ID: <span className="text-indigo-400 font-mono">{studentInfo.studentId}</span>) • Submitted: {new Date(gradingSubmission.submittedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setGradingSubmission(null)}
                  className="text-slate-400 hover:text-white text-xl self-end sm:self-center"
                >
                  ✕
                </button>
              </div>

              {/* Question-by-Question Evaluation Body */}
              <div className="flex-1 overflow-y-auto space-y-5 pr-1 custom-scrollbar">
                {(assignmentObj.tasks || []).map((task, tIdx) => {
                  const ans = gradingSubmission.answers?.[tIdx];
                  const qMarks = Number(task.marks) || 10;

                  return (
                    <div key={tIdx} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          <span>Q{tIdx + 1}:</span> {task.question}
                        </span>
                        <span className="text-[11px] font-black text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                          [ {qMarks} Marks ]
                        </span>
                      </div>

                      {/* MCQ Task */}
                      {task.type === "mcq" && (
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-300">
                            Student Selected Choice:{" "}
                            <span className={`font-black ${ans === task.correctIndex ? "text-emerald-400" : "text-rose-400"}`}>
                              {ans !== undefined ? `${ans + 1}. ${task.options?.[ans]}` : "Not answered"}
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Correct Choice: <span className="text-emerald-400 font-bold">{task.correctIndex + 1}. {task.options?.[task.correctIndex]}</span>
                          </p>
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${ans === task.correctIndex ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                            {ans === task.correctIndex ? `✓ Full Marks (${qMarks}/${qMarks})` : "✗ Incorrect (0 Marks)"}
                          </span>
                        </div>
                      )}

                      {/* Essay Task */}
                      {task.type === "essay" && (
                        <div className="space-y-3">
                          {task.explanation && (
                            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                              <span className="font-bold text-indigo-300 block mb-0.5">Teacher Marking Rubric / Key Points:</span>
                              {task.explanation}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                              <span className="font-bold">Student Written Answer:</span>
                              <span>Word Count: {typeof ans === "string" ? ans.trim().split(/\s+/).filter(Boolean).length : 0}</span>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                              {ans || <span className="text-slate-500 italic">No answer written</span>}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Diagram Task */}
                      {task.type === "diagram" && (
                        <div className="space-y-3">
                          <p className="text-[11px] text-slate-400">
                            <span className="font-bold text-slate-300">Instructions:</span> {task.instructions}
                          </p>
                          {ans ? (
                            <div className="space-y-2">
                              <img
                                src={ans}
                                alt="Student diagram"
                                className="max-h-72 rounded-xl border border-slate-700 object-contain bg-black cursor-pointer shadow"
                                onClick={() => window.open(ans, "_blank")}
                              />
                              <span className="text-[10px] text-slate-500 block">Click image to inspect full-screen in a new tab</span>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500 italic">No diagram file uploaded by student.</p>
                          )}
                        </div>
                      )}

                      {/* Web Dev & Programming Challenge Task */}
                      {task.type === "code" && (() => {
                        const codeObj = typeof ans === "object" && ans !== null ? ans : {};
                        const targetDoc = buildPreviewDocument(codeObj.html || "", codeObj.css || "", codeObj.js || "");

                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-indigo-400">Student Code & Live Sandboxed Output:</span>
                              {codeObj.autoScore !== undefined && (
                                <span className="px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs">
                                  Auto-Detected Score: {codeObj.autoScore} / {codeObj.maxMarks || qMarks} Marks
                                </span>
                              )}
                            </div>

                            {/* Live Output Preview */}
                            <iframe
                              title="Student Output Preview"
                              srcDoc={targetDoc}
                              sandbox="allow-scripts"
                              className="w-full h-48 rounded-xl border border-slate-800 bg-white shadow-inner"
                            />

                            {/* Code Tabs */}
                            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Code:</span>
                              <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto max-h-44 custom-scrollbar">
                                {codeObj.html || codeObj.css || codeObj.js ? (
                                  `<!-- HTML -->\n${codeObj.html || ""}\n\n/* CSS */\n${codeObj.css || ""}\n\n// JS\n${codeObj.js || ""}`
                                ) : (
                                  "No code submitted"
                                )}
                              </pre>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>

              {/* Overall Grading Footer */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-400 block mb-1">Final Score / Total Marks:</label>
                      <input
                        type="number"
                        placeholder="e.g. 85"
                        value={currentScore}
                        onChange={(e) =>
                          setGradingState({
                            ...gradingState,
                            [gradingSubmission._id]: { ...gradingState[gradingSubmission._id], score: e.target.value }
                          })
                        }
                        className="w-28 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-black text-amber-400 text-center outline-none focus:border-amber-500"
                      />
                    </div>
                    <span className="text-xs text-slate-400 font-bold self-end mb-2">
                      / {assignmentObj.totalMarks || 100} Marks
                    </span>
                  </div>

                  <div className="flex gap-2 self-end">
                    <button
                      type="button"
                      onClick={() => setGradingSubmission(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveDetailedGrade(
                          gradingSubmission._id,
                          currentScore,
                          currentFeedback,
                          gradingTaskScores
                        )
                      }
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-900/30 flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Publish Grade to Student</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Teacher Feedback & Review Remarks:</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Excellent work on the web form! Pay attention to input labels and padding."
                    value={currentFeedback}
                    onChange={(e) =>
                      setGradingState({
                        ...gradingState,
                        [gradingSubmission._id]: { ...gradingState[gradingSubmission._id], feedback: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ADD RECORDING MODAL */}
      {isAddRecordingOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-400" />
                <span>Add Live Class Recording ({selectedSessionGrade})</span>
              </h3>
              <button onClick={handleCloseRecordingModal} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddRecording} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Recording Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3: Elasticity of Demand Session"
                  value={recordingForm.title}
                  onChange={(e) => setRecordingForm({ ...recordingForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-rose-500"
                />
              </div>

              {/* VIDEO SOURCE SELECTOR (URL VS FILE BROWSE) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-400 block">Video Source *</label>
                  <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setRecordingSourceMode("url")}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                        recordingSourceMode === "url"
                          ? "bg-rose-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Globe className="w-3 h-3" /> Web URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecordingSourceMode("upload")}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                        recordingSourceMode === "upload"
                          ? "bg-rose-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <UploadCloud className="w-3 h-3" /> Browse File
                    </button>
                  </div>
                </div>

                {recordingSourceMode === "url" ? (
                  <div>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=... or direct MP4 link"
                      value={recordingForm.videoUrl}
                      onChange={(e) => setRecordingForm({ ...recordingForm, videoUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-rose-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Supports YouTube, Vimeo, Google Drive, or direct MP4 video link.</p>
                  </div>
                ) : (
                  <div>
                    <label className="border-2 border-dashed border-slate-700 hover:border-rose-500 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all text-center group">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                        className="hidden"
                        onChange={handleRecordingVideoUpload}
                        disabled={isUploadingRecordingVideo}
                      />
                      {isUploadingRecordingVideo ? (
                        <div className="flex flex-col items-center gap-2 py-2 text-rose-400">
                          <Loader2 className="w-7 h-7 animate-spin" />
                          <p className="text-xs font-bold">{recordingUploadStatus || "Uploading video to server..."}</p>
                          <span className="text-[10px] text-slate-500">Please wait while the file uploads...</span>
                        </div>
                      ) : recordingForm.videoUrl && recordingSourceMode === "upload" ? (
                        <div className="flex flex-col items-center gap-1.5 py-1">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-emerald-400">Video Attached Successfully</p>
                          <p className="text-[11px] text-slate-300 font-medium px-2 py-0.5 rounded bg-slate-800/80 max-w-[280px] truncate">
                            {recordingFileName || "Video File Attached"}
                          </p>
                          <span className="text-[10px] text-slate-500 group-hover:text-rose-400 underline transition-colors mt-0.5">
                            Click to choose a different video
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 py-2 text-slate-400">
                          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-white">Choose Video from Computer</p>
                          <p className="text-[10px] text-slate-500">Click to browse your device (MP4, WebM, MOV up to 250MB)</p>
                        </div>
                      )}
                    </label>
                    {recordingUploadStatus && !isUploadingRecordingVideo && (
                      <p className="text-[10px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {recordingUploadStatus}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Session Date</label>
                  <input
                    type="date"
                    value={recordingForm.date}
                    onChange={(e) => setRecordingForm({ ...recordingForm, date: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-white outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Duration Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. 1h 45m"
                    value={recordingForm.duration}
                    onChange={(e) => setRecordingForm({ ...recordingForm, duration: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-white outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseRecordingModal}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingRecordingVideo}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5"
                >
                  {isUploadingRecordingVideo && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Publish Recording</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STUDY MATERIAL MODAL */}
      {isAddMaterialOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Add Study Material / Tute ({selectedSessionGrade})</span>
              </h3>
              <button onClick={handleCloseMaterialModal} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3 Revision Tute & Short Notes"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-blue-500"
                />
              </div>

              {/* DOCUMENT SOURCE SELECTOR (URL VS FILE BROWSE) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-400 block">Document Source *</label>
                  <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => setMaterialSourceMode("url")}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                        materialSourceMode === "url"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Globe className="w-3 h-3" /> Web Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaterialSourceMode("upload")}
                      className={`px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                        materialSourceMode === "upload"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <UploadCloud className="w-3 h-3" /> Browse File
                    </button>
                  </div>
                </div>

                {materialSourceMode === "url" ? (
                  <div>
                    <input
                      type="text"
                      placeholder="https://drive.google.com/... or direct PDF link"
                      value={materialForm.videoUrl}
                      onChange={(e) => setMaterialForm({ ...materialForm, videoUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-blue-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Google Drive link, Dropbox link, or web PDF URL.</p>
                  </div>
                ) : (
                  <div>
                    <label className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all text-center group">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,image/*"
                        className="hidden"
                        onChange={handleMaterialFileUpload}
                        disabled={isUploadingMaterialFile}
                      />
                      {isUploadingMaterialFile ? (
                        <div className="flex flex-col items-center gap-2 py-2 text-blue-400">
                          <Loader2 className="w-7 h-7 animate-spin" />
                          <p className="text-xs font-bold">{materialUploadStatus || "Uploading document to server..."}</p>
                          <span className="text-[10px] text-slate-500">Please wait while the file uploads...</span>
                        </div>
                      ) : materialForm.videoUrl && materialSourceMode === "upload" ? (
                        <div className="flex flex-col items-center gap-1.5 py-1">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-emerald-400">Document Attached Successfully</p>
                          <p className="text-[11px] text-slate-300 font-medium px-2 py-0.5 rounded bg-slate-800/80 max-w-[280px] truncate">
                            {materialFileName || "Document Attached"}
                          </p>
                          <span className="text-[10px] text-slate-500 group-hover:text-blue-400 underline transition-colors mt-0.5">
                            Click to choose a different document
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 py-2 text-slate-400">
                          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-white">Choose Document from Computer</p>
                          <p className="text-[10px] text-slate-500">Click to browse your device (PDF, DOCX, PPTX supported)</p>
                        </div>
                      )}
                    </label>
                    {materialUploadStatus && !isUploadingMaterialFile && (
                      <p className="text-[10px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {materialUploadStatus}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Category / Type</label>
                  <select
                    value={materialForm.category}
                    onChange={(e) => setMaterialForm({ ...materialForm, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-blue-500"
                  >
                    <option value="Tute Paper">Tute Paper</option>
                    <option value="Short Notes">Short Notes</option>
                    <option value="Model Paper">Model Paper</option>
                    <option value="Past Paper">Past Paper</option>
                    <option value="Reference Book">Reference Book</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Upload Date</label>
                  <input
                    type="date"
                    value={materialForm.date}
                    onChange={(e) => setMaterialForm({ ...materialForm, date: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseMaterialModal}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingMaterialFile}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
                >
                  {isUploadingMaterialFile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Publish Material</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ADD PARTNER / REFERRAL LINK MODAL */}
      {isAddPartnerLinkOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-indigo-400" />
                <span>Add Partner / Study Link ({selectedSessionGrade})</span>
              </h3>
              <button
                onClick={() => setIsAddPartnerLinkOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPartnerLink} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Link Title / Resource Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Official WhatsApp Trading Discussion Group"
                  value={partnerLinkForm.title}
                  onChange={(e) => setPartnerLinkForm({ ...partnerLinkForm, title: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Target URL / Group Link *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://chat.whatsapp.com/..."
                  value={partnerLinkForm.url}
                  onChange={(e) => setPartnerLinkForm({ ...partnerLinkForm, url: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Category Tag
                </label>
                <select
                  value={partnerLinkForm.category}
                  onChange={(e) => setPartnerLinkForm({ ...partnerLinkForm, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                >
                  <option value="Study Community">Study Community</option>
                  <option value="WhatsApp Group">WhatsApp Group</option>
                  <option value="Telegram Channel">Telegram Channel</option>
                  <option value="Model Papers Forum">Model Papers Forum</option>
                  <option value="Bookstore Discount">Bookstore Discount</option>
                  <option value="Partner Resource">Partner Resource</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Short Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Free daily MCQs and discussions for A/L students"
                  value={partnerLinkForm.description}
                  onChange={(e) => setPartnerLinkForm({ ...partnerLinkForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-semibold text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddPartnerLinkOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20"
                >
                  Publish Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERIC ADD ITEM MODAL (FOR MATERIALS & REFERRALS) */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Add {lmsSubTab}</h3>
              <button
                onClick={() => setIsAddItemOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Title / Name..."
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LmsTab;
