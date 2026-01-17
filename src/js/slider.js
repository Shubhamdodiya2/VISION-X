const testimonials = [
  {
    img: 'assets/images/userIcon_Square.png',
    name: 'Tech Explorer',
    position: 'Early Adopter of Innovation',
    message: 'The platform gave me fresh perspectives and tools that I never imagined I needed. A true game-changer!'
  },
  {
    img: 'assets/images/userIcon_Square.png',
    name: 'Creative Spark',
    position: 'Community Contributor',
    message: 'Sharing my ideas here has been empowering. I feel part of something much bigger than myself.'
  },
  {
    img: 'assets/images/userIcon_Square.png',
    name: 'Smart Eco Thinker',
    position: 'Beta Tester',
    message: 'I have grown so much as a developer thanks to the workshops and mentorship at Vision X. Highly recommended!'
  },
  {
    img: 'assets/images/userIcon_Square.png',
    name: 'Visionary Mind',
    position: 'Innovation Advocate',
    message: 'The collaborative environment at Vision X pushes everyone to do their best work. Proud to be a part of this team.'
  },
  {
    img: 'assets/images/userIcon_Square.png',
    name: 'Idea Builder',
    position: 'Sustainability Enthusiast',
    message: 'Every interaction here feels like a spark of creativity. It fuels my motivation daily!'
  }
];
let currentTestimonial = 1;

function displayTestimonial(index) {
  let testimonialLeft;
  let testimonialRight;

  if (index === 0) {
    testimonialLeft = testimonials[testimonials.length - 1];
  } else {
    testimonialLeft = testimonials[index - 1];
  }

  if (index === testimonials.length - 1) {
    testimonialRight = testimonials[0];
  } else {
    testimonialRight = testimonials[index + 1];
  }

  document.getElementById('testimonial-img-left').src  = testimonialLeft.img;
  document.getElementById('testimonial-message-left').innerText = `"${testimonialLeft.message}"`;
  document.getElementById('testimonial-name-left').innerText = testimonialLeft.name;
  document.getElementById('testimonial-position-left').innerText = testimonialLeft.position;

  const testimonialMid = testimonials[index];
  document.getElementById('testimonial-img-mid').src  = testimonialMid.img;
  document.getElementById('testimonial-message-mid').innerText = `"${testimonialMid.message}"`;
  document.getElementById('testimonial-name-mid').innerText = testimonialMid.name;
  document.getElementById('testimonial-position-mid').innerText = testimonialMid.position;

  document.getElementById('testimonial-img-right').src  = testimonialRight.img;
  document.getElementById('testimonial-message-right').innerText = `"${testimonialRight.message}"`;
  document.getElementById('testimonial-name-right').innerText = testimonialRight.name;
  document.getElementById('testimonial-position-right').innerText = testimonialRight.position;
}

// Auto slide after every 3 seconds
setInterval(() => {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  displayTestimonial(currentTestimonial);
}, 3000);

displayTestimonial(currentTestimonial);