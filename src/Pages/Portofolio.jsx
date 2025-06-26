import React, { useEffect, useState, useCallback } from "react";
import { db, collection } from "../firebase";
import { getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Modal,
  IconButton,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import { Code, Award, Boxes } from "lucide-react";

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 hover:border-white/20 backdrop-blur-sm group relative overflow-hidden"
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-300 ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"
          }`}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

// Inline Certificate Component
const CertificateCard = ({ imageSrc, title, index }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "350px",
          margin: "0 auto",
          borderRadius: 3,
          overflow: "hidden",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(139, 92, 246, 0.15)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(10px)",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px) scale(1.02)",
            boxShadow: "0 20px 40px rgba(139, 92, 246, 0.25)",
            "& .overlay": {
              opacity: 1,
            },
            "& .hover-content": {
              transform: "translate(-50%, -50%)",
              opacity: 1,
            },
            "& img": {
              filter: "contrast(1.05) brightness(1.1) saturate(1.1)",
              transform: "scale(1.05)",
            },
          },
        }}
      >
        <Box sx={{ position: "relative", aspectRatio: "4/3" }}>
          <img
            src={imageSrc}
            alt={title || `Certificate ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              objectFit: "cover",
              filter: "contrast(1.10) brightness(0.9) saturate(1.1)",
              transition: "all 0.4s ease",
            }}
          />

          <Box
            className="overlay"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.4))",
              opacity: 0,
              transition: "all 0.3s ease",
              zIndex: 1,
            }}
          />

          <Box
            className="hover-content"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -60%)",
              opacity: 0,
              transition: "all 0.4s ease",
              color: "white",
              zIndex: 2,
              textAlign: "center",
            }}
          >
            <FullscreenIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" fontWeight={600}>
              View Certificate
            </Typography>
          </Box>
        </Box>

        {title && (
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: 600,
                textAlign: "center",
                fontSize: "0.9rem",
              }}
            >
              {title}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Modal for full view */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(5px)",
          },
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 2,
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.8)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={imageSrc}
            alt={title || "Certificate"}
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              display: "block",
              margin: "auto",
            }}
          />
        </Box>
      </Modal>
    </>
  );
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert2" },
];

// Static certificates data - no need to fetch from Firebase
const certificatesData = [
  {
    id: 1,
    imageSrc: "/certificate1.jpg",
    title: "CyberSecurity Internship Certification"
  },
  {
    id: 2,
    imageSrc: "/certificate2.jpg",
    title: "Investment Risk Management Certification"
  },
  {
    id: 3,
    imageSrc: "/certificate3.jpg",
    title: "Java Assessment Certification"
  },
  {
    id: 4,
    imageSrc: "/certificate4.jpg",
    title: "AWS Solutions Architechture Certification"
  },
  {
    id: 5,
    imageSrc: "/certificate5.jpg",
    title: "Investment Banking Certification"
  },
  {
    id: 6,
    imageSrc: "/certificate6.jpg",
    title: "Generative AI Career Essesntials Certification"
  },
  {
    id: 7,
    imageSrc: "/certificate7.jpg",
    title: "Microsoft Copilot Career AI Esssentials Certification"
  },
  {
    id: 8,
    imageSrc: "/certificate8.jpg",
    title: "CyberSecurity Foundations Certification"
  },
  {
    id: 9,
    imageSrc: "/certificate9.jpg",
    title: "CyberSecurity In Role Certification"
  },
  {
    id: 10,
    imageSrc: "/certificate10.jpg",
    title: "Deloitte Data Analytics Certification"
  },
  {
    id: 11,
    imageSrc: "/certificate11.jpg",
    title: "Electronic Arts Software Engineering Certification"
  },
  {
    id: 12,
    imageSrc: "/certificate12.jpg",
    title: "Ethical AI Implementation Certification"
  },
   {
    id: 13,
    imageSrc: "/certificate13.jpg",
    title: "Excel DataSheet with AI Certification"
  },
   {
    id: 14,
    imageSrc: "/certificate14.jpg",
    title: "Goldman Sachs Job Operations Certification"
  },
   {
    id: 15,
    imageSrc: "/certificate15.jpg",
    title: "Google Campaign Manager Certification"
  },
   {
    id: 16,
    imageSrc: "/certificate11.jpg",
    title: "Version Control with Git"
  },
   {
    id: 17,
    imageSrc: "/certificate17.jpg",
    title: "Kennedys Commercial Law Certification"
  },
   {
    id: 18,
    imageSrc: "/certificate18.jpg",
    title: "JPMorgan Quantitative Research Certification"
  },
   {
    id: 19,
    imageSrc: "/certificate19.jpg",
    title: "Quantium Data Analytics Certification"
  },
   {
    id: 20,
    imageSrc: "/certificate20.jpg",
    title: "TATA CyberSecurity Analyst Certification"
  },
   {
    id: 21,
    imageSrc: "/certificate21.jpg",
    title: "TATA Data Visualisation Certification"
  },   
  // Add more certificates as needed
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  const fetchProjects = useCallback(async () => {
    try {
      const projectCollection = collection(db, "projects");
      const projectSnapshot = await getDocs(projectCollection);

      const projectData = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        TechStack: doc.data().TechStack || [],
      }));

      setProjects(projectData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, []);

  useEffect(() => {
    AOS.init({ once: false });
    fetchProjects();
  }, [fetchProjects]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllCertificates(prev => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificatesData : certificatesData.slice(0, initialItems);

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden" id="Portofolio">
      {/* Header section */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          <span style={{
            color: '#6366f1',
            backgroundImage: 'linear-gradient(45deg, #6366f1 10%, #a855f7 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Portfolio Showcase
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects, certifications, and technical expertise.
          Each section represents a milestone in my continuous learning path.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
                  "& .lucide": {
                    color: "#a78bfa",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Projects"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Certificates"
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Tech Stack"
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>

        {value === 0 && (
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <CardProject
                      Img={project.Img}
                      Title={project.Title}
                      Description={project.Description}
                      Link={project.Link}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>
        )}
        {value === 1 && (
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedCertificates.map((certificate, index) => (
                  <div
                    key={certificate.id}
                    data-aos="fade-up"
                    data-aos-duration="1000"
                  >
                    <CertificateCard
                      imageSrc={certificate.imageSrc}
                      title={certificate.title}
                      index={index}
                    />
                  </div>
                ))}
              </div>
            </div>
            {certificatesData.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('certificates')}
                  isShowingMore={showAllCertificates}
                />
              </div>
            )}
          </TabPanel>
        )}
        {value === 2 && (
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        )}
      </Box>
    </div>
  );
}