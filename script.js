/* ===== Data kuis: ubah atau tambah soal di sini =====
   t = pertanyaan, o = pilihan jawaban, b = nomor jawaban benar (mulai dari 0), p = penjelasan */
const soal = [
  { t: "Bagian jahe yang dimanfaatkan adalah...",
    o: ["Akar sejati", "Rimpang (batang di dalam tanah)", "Buah", "Biji"],
    b: 1, p: "Jahe dimanfaatkan rimpangnya, yaitu batang yang tumbuh menjalar di dalam tanah." },
  { t: "Apa nama ilmiah jeruk purut?",
    o: ["Zingiber officinale", "Citrus limon", "Citrus hystrix", "Curcuma longa"],
    b: 2, p: "Jeruk purut bernama ilmiah Citrus hystrix, famili Rutaceae. Zingiber officinale adalah jahe." },
  { t: "Mengapa daun jeruk purut tampak seperti dua helai bersambung?",
    o: ["Tangkai daunnya melebar", "Daunnya dimakan serangga", "Dua daun tumbuh menempel", "Daunnya terbelah saat tua"],
    b: 0, p: "Itu satu helai daun dengan tangkai yang melebar, sehingga tampak seperti angka 8." },
  { t: "Senyawa apa yang menyebabkan rasa pedas hangat pada jahe?",
    o: ["Sitronelal", "Gingerol dan shogaol", "Flavonoid", "Klorofil"],
    b: 1, p: "Gingerol dan shogaol membuat jahe terasa pedas hangat. Sitronelal ada pada jeruk purut." },
  { t: "Urutan alur pembuatan produk yang benar adalah...",
    o: ["Pengemasan, panen, pengolahan, sortir", "Panen, pengolahan, sortir & cuci, pengemasan", "Sortir & cuci, panen, pengemasan, pengolahan", "Panen, sortir & cuci, pengolahan, pengemasan"],
    b: 3, p: "Bahan dipanen, disortir dan dicuci, diolah, baru dikemas menjadi produk." },
  { t: "Cara yang umum untuk mendapatkan minyak atsiri dari daun jeruk purut adalah...",
    o: ["Penyulingan dengan uap air", "Penggorengan", "Pembekuan", "Fermentasi"],
    b: 0, p: "Minyak atsiri mudah menguap, jadi diambil dengan penyulingan: uap membawa minyak, lalu diembunkan." }
];

const area = document.getElementById("kuis-area");
let nomor = 0;
let skor = 0;

/* Pembantu kecil untuk membuat elemen */
function buat(tag, kelas, teks) {
  const e = document.createElement(tag);
  if (kelas) e.className = kelas;
  if (teks) e.textContent = teks;
  return e;
}

/* Tampilkan satu soal. fokus = true agar pembaca layar & keyboard pindah ke soal baru */
function tampilSoal(fokus) {
  const s = soal[nomor];
  area.replaceChildren();

  const tanya = buat("h3", "tanya", s.t);
  tanya.tabIndex = -1;
  const opsi = buat("div", "opsi");
  const umpan = buat("div", "umpan");
  umpan.setAttribute("aria-live", "polite");
  const lanjut = buat("button", "tombol", nomor < soal.length - 1 ? "Soal berikutnya" : "Lihat skor");
  lanjut.type = "button";
  lanjut.hidden = true;

  s.o.forEach((teks, n) => {
    const tombol = buat("button", "pilihan", teks);
    tombol.type = "button";
    tombol.addEventListener("click", () => {
      const benar = n === s.b;
      if (benar) skor++;
      opsi.querySelectorAll("button").forEach((x, k) => {
        x.disabled = true;
        if (k === s.b) x.classList.add("benar");
        else if (k === n) x.classList.add("salah");
      });
      umpan.className = "umpan " + (benar ? "ok" : "no");
      umpan.textContent = (benar ? "Benar! " : "Belum tepat. ") + s.p;
      lanjut.hidden = false;
      lanjut.scrollIntoView({ block: "nearest" });
    });
    opsi.append(tombol);
  });

  lanjut.addEventListener("click", () => {
    nomor++;
    if (nomor < soal.length) tampilSoal(true);
    else tampilSkor();
  });

  area.append(buat("p", "progres", "Soal " + (nomor + 1) + " dari " + soal.length), tanya, opsi, umpan, lanjut);
  if (fokus) tanya.focus();
}

/* Tampilkan skor akhir dan tombol ulangi */
function tampilSkor() {
  area.replaceChildren();
  let pesan = "Ayo baca lagi materinya, lalu coba sekali lagi.";
  if (skor === soal.length) pesan = "Sempurna! Kamu sudah paham materinya.";
  else if (skor >= 4) pesan = "Bagus! Sedikit lagi sempurna.";
  else if (skor >= 2) pesan = "Lumayan. Baca ulang bagian yang belum kamu kuasai.";

  const judul = buat("h3", "tanya", "Kuis selesai");
  judul.tabIndex = -1;
  const ulang = buat("button", "tombol", "Ulangi kuis");
  ulang.type = "button";
  ulang.addEventListener("click", () => { nomor = 0; skor = 0; tampilSoal(true); });

  area.append(judul, buat("p", "skor", skor + " / " + soal.length), buat("p", "", pesan), ulang);
  judul.focus();
}

tampilSoal(false);
