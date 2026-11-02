import hall from './assets/img/datacenter-hall.jpg'
import campus from './assets/img/campus-aerial.jpg'
import building from './assets/img/datacenter-building.jpg'
import office from './assets/img/office-building.jpg'
import videoPoster from './assets/img/video-poster.jpg'
import solar from './assets/img/solar-panels.jpg'
import industry from './assets/img/project-industry.svg'
import certReg from './assets/img/cert-registration.jpg'
import certIt from './assets/img/cert-itpark.jpg'
import galleryReplace from './assets/img/IMG_20261102_213401_617.jpg'

export const PHONES = [
  { label: '+998 91 269 59 59', href: 'tel:+998912695959' },
  { label: '+998 77 167 69 69', href: 'tel:+998771676969' },
]

export const EMAILS = [
  { address: 'info@atim.uz', role: 'email_info' },
  { address: 'office@atim.uz', role: 'email_office' },
  { address: 'director@atim.uz', role: 'email_director' },
  { address: 'projects@atim.uz', role: 'email_projects' },
]

export const NAV = [
  { id: 'about', key: 'nav_about' },
  { id: 'projects', key: 'nav_projects' },
  { id: 'roadmap', key: 'nav_roadmap' },
  { id: 'certificates', key: 'nav_certs' },
  { id: 'partners', key: 'nav_partners' },
  { id: 'contact', key: 'nav_contact' },
]

export const SLIDES = [
  { img: hall, caption: 'slide_hall' },
  { img: campus, caption: 'slide_campus' },
  { img: office, caption: 'slide_office' },
]

export const PROJECTS = [
  { no: '01 / DIGITAL', title: 'NUKUS — Digital Infrastructure & AI', text: 'p1', status: 'status_concept', img: hall },
  { no: '02 / ENERGY', title: 'NUKUS — Solar Energy & BESS', text: 'p2', status: 'status_prelim', img: solar },
  { no: '03 / INDUSTRY', title: 'Besqala Mining Valley', text: 'p3', status: 'status_development', img: industry },
]

export const GALLERY = [
  { img: campus, caption: 'slide_campus' },
  { img: building, caption: 'g_building' },
  { img: hall, caption: 'slide_hall' },
  { img: galleryReplace, caption: 'slide_office' },
]

export const ROADMAP = [
  { title: 'ATIM Investment Platform', text: 'r1', tag: 'FOUNDATION' },
  { title: 'Digital Infrastructure & AI', text: 'r2', tag: 'TECHNOLOGY' },
  { title: 'Solar Energy & BESS', text: 'r3', tag: 'ENERGY' },
  { title: 'Besqala Mining Valley', text: 'r4', tag: 'INDUSTRY' },
  { title: 'ATIM Digital Assets & Tokenization', text: 'r5', tag: 'FUTURE FINANCE', highlight: true },
  { title: 'International Expansion', text: 'r6', tag: 'GLOBAL' },
]

export const CERTS = [
  { title: 'doc_reg', meta: 'cert_reg_meta', img: certReg },
  { title: 'doc_it', meta: 'cert_it_meta', img: certIt },
]

export const VIDEO = {
  src: `${import.meta.env.BASE_URL}media/nukus-atim.mp4`,
  poster: videoPoster,
}
