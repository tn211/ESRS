import React from "react";
import './AboutUs.css';
import Layout2 from "../../components/layout-components/Layout2";
import stock1 from "../../assets/istockphoto-1253249134-612x612.jpg";
import stock2 from "../../assets/istockphoto-1199670834-1024x1024 1.png";
import stock3 from "../../assets/hide.png";

const AboutUs = () => {
    return (
        <Layout2>

            <div className="sora1">
                <div className="text-container">
                    <p style={{ fontFamily: 'Josefin Sans', fontSize: '50px' }}>About us</p>
                    <p className="stretch">
                        We are a team passionate about cooking and all the cultural diversity that it can provide and be expressed through it. This love for sharing our experiences led us to create DishConnect, a great community for every person, with or without experience, to explore and contribute to this wonderful world of gastronomy.
                    </p>
                </div>
                <img src={stock1} alt="img1" className="image1" />
            </div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className="sora1">
                <img src={stock2} alt="img2" className="image2" />
                <div className="text-container2">
                    <p style={{ fontFamily: 'Josefin Sans', fontSize: '50px' }}>Our Mission</p>
                    <p className="stretch">
                        Our mission is to create the most diverse and friendly culinary community, empowering people from all over the world to share, explore and enjoy recipes from every corner of the planet, promoting the exchange of knowledge and experiences.
                    </p>
                </div>

            </div>
            <br></br>
            <div className="sora1h">
                <img src={stock3} alt="img3" className="image3" />
            </div>
        </Layout2>
    );
};

export default AboutUs;
