import React, { useState } from "react";
import {
  Modal,
  IconButton,
  Box,
  Backdrop,
  Typography,
  CssBaseline,
  Container,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

const Certificate = () => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // List of certificate image paths
  const certificateImages = [
    "/certificate1.jpg",
    "/certificate2.jpg",
    "/certificate3.jpg",
    "/certificate4.jpg",
    "/certificate5.jpg",
    "/certificate6.jpg",
    "/certificate7.jpg",
    "/certificate8.jpg",
    "/certificate9.jpg",
    "/certificate10.jpg",
    "/certificate11.jpg",
    "/certificate12.jpg",
    "/certificate13.jpg",
    "/certificate14.jpg",        
    "/certificate15.jpg",
    "/certificate16.jpg",
    "/certificate17.jpg",
    "/certificate18.jpg",
    "/certificate19.jpg",
    "/certificate20.jpg",
    "/certificate21.jpg",
  ];

  const handleOpen = (src) => {
    setSelectedImage(src);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          gutterBottom
        >
          
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
            mt: 3,
          }}
        >
          {certificateImages.map((src, index) => (
            <Box
              key={index}
              onClick={() => handleOpen(src)}
              sx={{
                position: "relative",
                width: "250px",
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: 3,
                "&:hover .overlay": {
                  opacity: 1,
                },
                "&:hover .hover-content": {
                  transform: "translate(-50%, -50%)",
                  opacity: 1,
                },
                "&:hover img": {
                  filter: "contrast(1.05) brightness(1) saturate(1.1)",
                },
              }}
            >
              <Box sx={{ position: "relative" }}>
                <img
                  src={src}
                  alt={`Certificate ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    objectFit: "cover",
                    filter: "contrast(1.10) brightness(0.9) saturate(1.1)",
                    transition: "filter 0.3s ease",
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
                    backgroundColor: "rgba(0,0,0,0.4)",
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
            </Box>
          ))}
        </Box>

        {/* Zoom Modal */}
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
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Zoomed Certificate"
                style={{
                  maxWidth: "100%",
                  maxHeight: "90vh",
                  display: "block",
                  margin: "auto",
                }}
              />
            )}
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default Certificate;
