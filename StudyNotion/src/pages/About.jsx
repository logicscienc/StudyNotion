import React from 'react'
import HighlightText from '../components/core/HomePage/HighlightText';
import BannerImage1 from "../assets/Images/aboutus1.webp";
import BannerImage2 from "../assets/Images/aboutus2.webp";
import BannerImage3 from "../assets/Images/aboutus3.webp";
import Quote from '../components/core/AboutPage/Quote';
import FoundingStory from "../assets/Images/FoundingStory.png";import StatsComponent from '../components/core/AboutPage/Stats';
import LearningGrid from '../components/core/AboutPage/LearningGrid';
import ContactFormSection from '../components/core/AboutPage/ContactFormSection';


const About = () => {
  return (
    <div className='mx-auto mt-[100px] text-white w-11/12 max-w-maxContent'>
      {/* section 1 */}
      <section>
        <div>
            <header>
                Driving Innovation in Online Education for a
                <HighlightText text= {"Brighter Future"}/>

                <p>Studynotion is at the forefront of driving innovation in online education. We're passinate about creting a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.</p>

            </header>

            <div className='flex gap-x-3 mx-auto'>
                <img  src={BannerImage1}/>
                <img  src={BannerImage2}/>
                <img  src={BannerImage3}/>
            </div>
        </div>
      </section>

      {/* section */}

      <section>
        <div>
          <Quote/>
        </div>
      </section>

      {/* section 3 */}
      <section>
        <div className='flex flex-col'>
          {/* founding story wala div */}
          <div className='flex'>
            {/* founding story left box */}
            <div>
              <h1>Our Founding Story</h1>

              <p>Our e-learning plathform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologistics, and lifelong who recoginized the need of accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.</p>


              <p>As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education system. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundries. We envisioned a platform thta could bridge these gaps and empower individuals from all walks of life to unlock their full potential.</p>
            </div>
            {/* founding story right box */}
            <div>
              <img src={FoundingStory}/>
            </div>
          </div>
          {/* vision and mission wala parent div  */}
          <div className='flex'>
            {/* left box */}
            <div>
              <h1>Our Vision</h1>
              <p>With this vision in mind, we set out on a journey to create an e-learning platform thta would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and intractive learning experience.</p>
            </div>

            {/* right box */}
            <div>
              <h1>
                Our Mission
              </h1>

              <p>Our mission goes behond just delivering courses online. we wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe taht knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.</p>
            </div>
          </div>
        </div>
      </section> 

      {/* section 4 */}
      <StatsComponent/>

      {/* Section 5 */}

      <section className='mx-auto flex flex-col items-center justify-between gap-5'>
        <LearningGrid/>
        <ContactFormSection/>
      </section>


    </div>
  )
}

export default About
