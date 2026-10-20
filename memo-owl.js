(()=>{
  // Contextual chapter and timer owls intentionally disabled.
  // The home mascot is independent and remains untouched.
  if(!document.querySelector('script[data-memo-schemat-course]')){
    const s=document.createElement('script');s.src='schemat-course-controls.js';s.dataset.memoSchematCourse='1';document.body.appendChild(s);
  }
})();
