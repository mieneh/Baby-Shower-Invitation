import { useState, useEffect } from "react";
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Send,
  Sparkles,
  Gift,
  Star,
  PartyPopper,
  Baby,
  ChevronLeft,
  ChevronRight,
  Flag,
  Bookmark,
  Cake,
  ToyBrick,
  Footprints,
  Smile,
} from "lucide-react";
import { ImageWithFallback } from "./components/ImageWithFallback";
import { PlayfulGallery } from "./components/PlayfulGallery";
import { motion } from "motion/react";
import { supabase } from "../lib/supabase";

interface Wish {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export default function App() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const wishesPerPage = 5;

  const eventDetails = {
    babyName: "Tuệ Anh",
    date: "24/01/2026",
    time: "18:00",
    address: "3 Tổ 23/342 Đ. Bùi Trọng Nghĩa, KP 3A, Biên Hòa, Đồng Nai",
    locationQR:
      "https://res.cloudinary.com/farm-track/image/upload/v1767442419/qrcode_294610718_880981b8666a0e67dca1ce8b0a4d6dfe_wn86jx.png",
  };

  const photos = [
    "https://res.cloudinary.com/farm-track/image/upload/v1767434627/2.jpg",
    "https://res.cloudinary.com/farm-track/image/upload/v1767434625/3.jpg",
    "https://res.cloudinary.com/farm-track/image/upload/v1767434625/4.jpg",
    "https://res.cloudinary.com/farm-track/image/upload/v1767434625/5.jpg",
    "https://res.cloudinary.com/farm-track/image/upload/v1767434625/6.jpg",
    "https://res.cloudinary.com/farm-track/image/upload/v1767434627/7.jpg",
  ];

  const photosMobile = [
    photos[0],
    photos[2],
    photos[1],
    photos[4],
    photos[3],
    photos[5],
  ];

  const milestones = [
    {
      month: "0 tháng",
      title: "Chào đời",
      desc: "Con đến với thế giới trong vòng tay yêu thương và những lời chúc ngọt ngào.",
      icon: Baby,
      images: [
        "https://res.cloudinary.com/farm-track/image/upload/v1767522313/11_rvepcx.jpg",
        "https://res.cloudinary.com/farm-track/image/upload/v1767522313/12_otzkyl.jpg",
      ],
    },
    {
      month: "1 tháng",
      title: "Đầy tháng yêu thương",
      desc: "Tròn một tháng tuổi, con nhận được thật nhiều yêu thương và nụ cười dịu dàng.",
      icon: Heart,
      images: [
        "https://res.cloudinary.com/farm-track/image/upload/v1767522313/21_d88qoj.jpg",
        "https://res.cloudinary.com/farm-track/image/upload/v1767522314/22_uuftvv.jpg",
      ],
    },
    {
      month: "3 tháng",
      title: "Biết cười, biết ê a",
      desc: "Con bắt đầu ê a, nở những nụ cười trong veo làm cả nhà tan chảy.",
      icon: Smile,
      images: [
        "https://res.cloudinary.com/farm-track/image/upload/v1767522313/31_f7j1yy.jpg",
        "https://res.cloudinary.com/farm-track/image/upload/v1767522313/32_dmsrpt.jpg",
      ],
    },
    {
      month: "5 tháng",
      title: "Khám phá thế giới nhỏ",
      desc: "Con thích thú quan sát mọi thứ xung quanh, mỗi ngày là một điều mới mẻ.",
      icon: Sparkles,
      images: [
        "https://res.cloudinary.com/farm-track/image/upload/v1767522315/41_liycan.jpg",
        "https://res.cloudinary.com/farm-track/image/upload/v1767522313/42_kadqhp.jpg",
      ],
    },
    {
      month: "7 tháng",
      title: "Biết lật, biết bò",
      desc: "Con bắt đầu lật, bò khắp nơi với ánh mắt tò mò và đầy năng lượng.",
      icon: Footprints,
      images: [
        "https://res.cloudinary.com/farm-track/image/upload/v1767522314/51_mf1ogc.jpg",
        "https://res.cloudinary.com/farm-track/image/upload/v1767522314/52_r9lool.jpg",
      ],
    },
    {
      month: "9 tháng",
      title: "Lớn khôn từng ngày",
      desc: "Con cứng cáp hơn, thích chơi đùa và luôn mang đến tiếng cười cho mọi người.",
      icon: ToyBrick,
      images: [
        "https://res.cloudinary.com/farm-track/image/upload/v1767522314/61_c7jlxu.jpg",
        "https://res.cloudinary.com/farm-track/image/upload/v1767522314/62_pqmxdx.jpg",
      ],
    },
    {
      month: "11 tháng",
      title: "Chuẩn bị tròn một tuổi",
      desc: "Con sắp tròn một tuổi, đánh dấu hành trình đầu đời đầy yêu thương và kỷ niệm.",
      icon: Cake,
      images: [
        "https://res.cloudinary.com/farm-track/image/upload/v1767522314/71_ethugl.jpg",
        "https://res.cloudinary.com/farm-track/image/upload/v1767522314/72_f6aoaa.jpg",
      ],
    },
  ];

  useEffect(() => {
    const fetchWishes = async () => {
      const { data, error } = await supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setWishes(data);
      }
    };
    fetchWishes();
  }, []);

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const { error } = await supabase.from("wishes").insert([
      {
        name: name.trim(),
        message: message.trim(),
      },
    ]);

    if (error) {
      console.error(error);
      alert("Gửi lời chúc thất bại.");
    } else {
      setName("");
      setMessage("");
      setCurrentPage(1);
      const { data } = await supabase
        .from("wishes")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setWishes(data);
    }

    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Pagination logic
  const indexOfLastWish = currentPage * wishesPerPage;
  const indexOfFirstWish = indexOfLastWish - wishesPerPage;
  const currentWishes = wishes.slice(indexOfFirstWish, indexOfLastWish);
  const totalPages = Math.ceil(wishes.length / wishesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    document
      .getElementById("wishes-list")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255, 182, 193, 0.1) 0%, transparent 50%), 
                           radial-gradient(circle at 80% 70%, rgba(221, 160, 221, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, rgba(255, 192, 203, 0.05) 0%, transparent 100%)`,
          }}
        ></div>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {["🌸", "🎀", "💕", "✨", "🦋"][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-pink-50 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-32">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="bg-gradient-to-r from-pink-100 via-rose-100 to-purple-100 border-2 border-pink-300 rounded-full px-8 py-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <PartyPopper className="w-5 h-5 text-pink-500" />
                  <span className="text-pink-600">You're Invited</span>
                  <PartyPopper className="w-5 h-5 text-pink-500" />
                </div>
              </div>
            </motion.div>
          </motion.div>
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <motion.div
              className="hidden lg:block lg:col-span-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ImageWithFallback
                      src={photos[i]}
                      alt={`Decoration ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute -inset-8 bg-gradient-to-br from-pink-200 via-rose-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative">
                  <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative">
                    <ImageWithFallback
                      src="https://res.cloudinary.com/farm-track/image/upload/v1767434627/1.jpg"
                      alt="Bé Tuệ Anh"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pink-900/10 to-transparent"></div>
                  </div>
                  <motion.div
                    className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-2xl p-4 border-4 border-pink-200"
                    animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Baby className="w-8 h-8 text-pink-500" />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-4 -right-4 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl shadow-2xl p-6 text-white"
                    animate={{ y: [0, 10, 0], rotate: [5, -5, 5] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                  >
                    <div className="text-center">
                      <div className="text-4xl font-serif">1</div>
                      <div className="text-xs">tuổi</div>
                    </div>
                  </motion.div>
                </div>
                <motion.div
                  className="text-center mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="mb-4">
                    <span className="text-pink-400 tracking-widest uppercase text-sm">
                      Lễ Thôi Nôi
                    </span>
                  </div>
                  <h1 className="text-7xl md:text-8xl font-serif mb-4 bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                    {eventDetails.babyName}
                  </h1>
                  <div className="flex items-center justify-center gap-3 text-pink-500">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-pink-300"></div>
                    <Star className="w-6 h-6 fill-pink-400 text-pink-400" />
                    <span className="text-xl font-serif">Turning One</span>
                    <Star className="w-6 h-6 fill-pink-400 text-pink-400" />
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-pink-300"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              className="hidden lg:block lg:col-span-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                {[3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white"
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ImageWithFallback
                      src={photos[i]}
                      alt={`Decoration ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 overflow-hidden"
          style={{ height: "120px" }}
        >
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z"
              fill="url(#wave-gradient)"
            />
            <defs>
              <linearGradient
                id="wave-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#fbcfe8", stopOpacity: 0.3 }}
                />
                <stop
                  offset="50%"
                  style={{ stopColor: "#fda4af", stopOpacity: 0.3 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#e9d5ff", stopOpacity: 0.3 }}
                />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="relative py-24 bg-white">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-white to-pink-50/50 rounded-3xl p-12 shadow-xl border-2 border-pink-100 text-center">
            <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-6" />
            <p className="text-pink-600 italic mb-6">
              Kính gửi gia đình và bạn bè thân yêu,
            </p>
            <p className="text-pink-700 text-lg leading-relaxed mb-6">
              Gia đình con/em rất vui mừng và hân hạnh được mời quý ông, bà, cô,
              chú, bác, anh, chị, em và bạn bè thân yêu đến tham dự buổi tiệc
              thôi nôi của bé {eventDetails.babyName}.
            </p>
            <p className="text-pink-700 text-lg leading-relaxed mb-6">
              Đây là dịp đặc biệt để mọi người cùng sum họp, chia sẻ niềm vui
              lưu giữ những khoảnh khắc đáng nhớ bên công chúa nhỏ.
            </p>
            <p className="text-pink-600 italic">
              Sự hiện diện của mọi người chính là món quà ý nghĩa nhất dành cho
              bé yêu!
            </p>
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative py-24 bg-gradient-to-b from-pink-50/30 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Bookmark className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h2 className="text-pink-600 mb-4">Thông Tin Buổi Tiệc</h2>
            <p className="text-pink-500 text-xl">
              Cùng tham dự tiệc thôi nôi của bé {eventDetails.babyName}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              {
                icon: Calendar,
                label: "Ngày",
                value: "Thứ Bảy",
                subvalue: eventDetails.date,
                color: "pink",
              },
              {
                icon: Clock,
                label: "Giờ",
                value: eventDetails.time,
                subvalue: "Chiều thứ Bảy",
                color: "pink",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-pink-100 text-center h-full">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 rounded-2xl mb-6`}
                  >
                    <item.icon className={`w-8 h-8 text-${item.color}-600`} />
                  </div>
                  <h3
                    className={`text-${item.color}-600 text-base mb-2 tracking-wider uppercase`}
                  >
                    {item.label}
                  </h3>
                  <p className={`text-${item.color}-800 text-2xl mb-3`}>
                    {item.value}
                  </p>
                  <p className={`text-${item.color}-600`}>{item.subvalue}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-pink-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 p-6 text-center">
              <MapPin className="w-8 h-8 text-white mx-auto mb-4" />
              <h3 className="text-white text-sm mb-2 tracking-wider uppercase">
                Địa Điểm Tổ Chức
              </h3>
              <p className="text-pink-50 text-2xl mb-3">Tư gia</p>
              <p className="text-white">{eventDetails.address}</p>
            </div>
            <div className="p-10">
              <div className="text-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8">
                <p className="text-pink-600 mb-6">Quét mã QR để xem bản đồ</p>
                <div className="flex justify-center mb-8">
                  <div className="bg-white p-6 rounded-2xl shadow-lg inline-block">
                    <ImageWithFallback
                      src={eventDetails.locationQR}
                      alt="QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                </div>
                <a
                  href="https://maps.app.goo.gl/WqyjuWocKu5RNBvTA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white px-8 py-3 rounded-full hover:shadow-xl transition-all hover:scale-105 border border-[#e9d5ff]/20"
                >
                  Xem trên Google Maps
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="py-24 bg-gradient-to-b from-pink-50/30 to-white lg:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h2 className="text-pink-600 mb-4">Khoảnh Khắc Ngọt Ngào</h2>
            <p className="text-pink-500 text-xl">
              Những hình ảnh đáng yêu của bé {eventDetails.babyName}
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-6 md:hidden">
            {photosMobile.map((photo, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative aspect-square">
                  <ImageWithFallback
                    src={photo}
                    alt={`Bé ${eventDetails.babyName} ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                      <Heart className="w-8 h-8 text-white fill-white mx-auto" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <motion.div
                key={index}
                className="group relative overflow-hidden rounded-3xl shadow-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative aspect-square">
                  <ImageWithFallback
                    src={photo}
                    alt={`Bé ${eventDetails.babyName} ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                      <Heart className="w-8 h-8 text-white fill-white mx-auto" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 bg-gradient-to-b from-pink-50/40 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Flag className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h2 className="text-pink-600 mb-4">Cột Mốc Thời Gian</h2>
            <p className="text-pink-500 text-xl">
              Lưu giữ hành trình lớn lên của bé {eventDetails.babyName}
            </p>
          </div>
          <div className="space-y-10">
            {milestones.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-12 items-center bg-white rounded-3xl p-10 shadow-xl border-2 border-pink-100"
              >
                <div className={`${index % 2 === 1 ? "md:order-2" : ""}`}>
                  <div className="flex items-center gap-4 mb-6">
                    {item && <item.icon className="w-10 h-10 text-pink-500" />}
                    <div>
                      <div className="text-pink-400 uppercase tracking-wider text-sm">
                        {item.month}
                      </div>
                      <h3 className="text-pink-700">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-pink-600 leading-relaxed">{item.desc}</p>
                </div>
                <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                  <PlayfulGallery images={item.images} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-24 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Gift className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h2 className="text-pink-600 mb-4">Sổ Lưu Bút</h2>
            <p className="text-pink-500 text-xl">
              Gửi lời chúc yêu thương đến bé {eventDetails.babyName}
            </p>
          </motion.div>
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-10 shadow-xl border-2 border-pink-100">
              <form onSubmit={handleSubmitWish} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-pink-700 mb-3 text-lg"
                  >
                    Tên của bạn
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-all bg-white shadow-sm"
                    placeholder="Nhập tên của bạn..."
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-pink-700 mb-3 text-lg"
                  >
                    Lời chúc của bạn
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-all resize-none bg-white shadow-sm"
                    placeholder="Viết lời chúc ngọt ngào cho bé..."
                    required
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <span>Đang gửi...</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Gửi lời chúc</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
          {wishes.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-center mb-10">
                <h3 className="text-pink-600">
                  {wishes.length} lời chúc yêu thương
                </h3>
              </div>
              <div className="space-y-6" id="wishes-list">
                {currentWishes.map((wish, index) => (
                  <motion.div
                    key={wish.id}
                    className="bg-white rounded-2xl p-8 shadow-lg border-2 border-pink-100 hover:border-pink-300 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-pink-400 via-rose-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-2xl text-white">
                          {wish.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-pink-700 text-lg">
                            {wish.name}
                          </span>
                          <span className="text-pink-300">•</span>
                          <span className="text-pink-400 text-sm">
                            {formatDate(wish.created_at)}
                          </span>
                        </div>
                        <p className="text-pink-800 leading-relaxed text-lg">
                          {wish.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {totalPages > 1 && (
                <motion.div
                  className="flex items-center justify-center gap-3 mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-pink-200 text-pink-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-pink-400 hover:bg-pink-50 transition-all shadow-md"
                    whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                    whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Trước</span>
                  </motion.button>
                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      const showPage =
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1);
                      const showEllipsis =
                        (pageNumber === 2 && currentPage > 3) ||
                        (pageNumber === totalPages - 1 &&
                          currentPage < totalPages - 2);
                      if (showEllipsis) {
                        return (
                          <span key={pageNumber} className="text-pink-400 px-2">
                            ...
                          </span>
                        );
                      }
                      if (!showPage) return null;
                      return (
                        <motion.button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-12 h-12 rounded-xl transition-all shadow-md ${
                            currentPage === pageNumber
                              ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white"
                              : "bg-white border-2 border-pink-200 text-pink-600 hover:border-pink-400 hover:bg-pink-50"
                          }`}
                          whileHover={
                            currentPage !== pageNumber ? { scale: 1.1 } : {}
                          }
                          whileTap={
                            currentPage !== pageNumber ? { scale: 0.9 } : {}
                          }
                        >
                          {pageNumber}
                        </motion.button>
                      );
                    })}
                  </div>
                  <motion.button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-pink-200 text-pink-600 disabled:opacity-30 disabled:cursor-not-allowed hover:border-pink-400 hover:bg-pink-50 transition-all shadow-md"
                    whileHover={
                      currentPage !== totalPages ? { scale: 1.05 } : {}
                    }
                    whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                  >
                    <span>Sau</span>
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500 py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-4 mb-8">
            {["🎀", "🌸", "💕", "✨", "🦋"].map((emoji, i) => (
              <motion.span
                key={i}
                className="text-5xl"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
          <h3 className="text-white mb-6 text-4xl">Trân Trọng Kính Mời</h3>
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl px-10 py-6 mb-6">
            <p className="text-white text-2xl mb-2">
              Gia đình bé {eventDetails.babyName}
            </p>
            <p className="text-pink-100 text-lg">
              Rất mong được đón tiếp tất cả mọi người
            </p>
          </div>
          <div className="flex justify-center gap-2 mt-8">
            <div className="h-px w-20 bg-white/30 mt-2"></div>
            <Heart className="w-5 h-5 text-white fill-white" />
            <div className="h-px w-20 bg-white/30 mt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
