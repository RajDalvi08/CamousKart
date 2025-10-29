import React from "react";
import "./about.css";
import { useNavigate } from "react-router-dom";


const About = () => {
  const navigate = useNavigate();
  

  const items = [
   {
  name: "Old Lab Coat",
  description: "Affordable pre-loved lab coats, perfect for your first year practical sessions. They’re comfortable, reliable, and budget-friendly!",
  path: "/labcoats",
  
},

    { 
      name: "New Lab Coat", 
      description: "Brand new lab coats for those who love a fresh start. Look sharp and experiment safely in style.", 
      path: "/labcoats"
    },
    { 
      name: "Books", 
      description: "Engineering textbooks, guides, and reference materials to power you through semesters. From basic physics to advanced coding!", 
      path: "/books"
    },
    { 
      name: "Calculator", 
      description: "Scientific calculators tested and approved by toppers. A must-have for exams, labs, and solving tricky problems on the go.", 
      path: "/calculators"
    },
    { 
      name: "Drafter", 
      description: "Top-notch drafting tools for precise engineering drawing classes. Durable, accurate, and student-friendly.", 
      path: "/drafters"
    },
    { 
      name: "EG Kit", 
      description: "Pens, pencils, markers, rulers, and highlighters – everything bundled in one perfect kit.", 
      path: "/egkit"
    },
    { 
      name: "EG Container", 
      description: "Affordable lab essentials, including glassware, wires, multimeters, and resistors to fuel your projects.", 
      path: "/egcontainer"
    },
    { 
      name: "Electronics", 
      description: "Arduino boards, sensors, motors, and electronic kits – perfect for innovation and final year projects.", 
      path: "/electronics"
    },
  ];

  return (
    <div className="about-container" id="about">
      <h2 className="about-title">Welcome to CampusKart </h2>
      <p className="about-intro">
        CampusKart isn’t just a marketplace – it’s your <strong>college survival kit</strong>!  
        Imagine a place where you can buy or sell lab coats, drafter kits, calculators, books, 
        and even second-hand electronics, all under one roof. That’s CampusKart.  
        <br /><br />
        Whether you’re a fresher trying to find your first lab coat or a final-year student selling 
        your old drafter, CampusKart helps you save money and pass the legacy on.  
        <br /><br />
        Why spend extra on items you’ll use for only a few semesters when you can get them 
        at half the cost – in great condition? At the same time, selling your old stuff means 
        you’re helping juniors, making extra cash, and promoting sustainability 🌱.  
        <br /><br />
        <strong>Think of CampusKart as the OLX for students – but more fun, colorful, and campus-focused!</strong>
      </p>

      <div className="about-grid">
        {items.map((item, index) => (
          <div key={index} className="about-card">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <button 
              className="explore-btn" 
              onClick={() => navigate(item.path)}
            >
              Explore →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
