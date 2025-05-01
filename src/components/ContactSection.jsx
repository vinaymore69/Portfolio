import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    email: '',
    query: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, surname, email, query } = formData;

    const { data, error } = await supabase
      .from('contacts') // table name
      .insert([
        {
          first_name: firstName,
          surname: surname,
          email: email,
          query: query,
        },
      ]);

    if (error) {
      console.error('Error inserting data:', error);
      alert('Something went wrong!');
    } else {
      console.log('Data inserted successfully:', data);
      alert('Message sent!');
      setFormData({ firstName: '', surname: '', email: '', query: '' });
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center max-w-4xl w-full mx-auto min-h-screen justify-center px-4 py-8">
      {/* Image - smaller on mobile, proper sizing on desktop */}
      <div className="w-full flex justify-center md:w-auto mr-9 md:justify-start">
        <img
          src="./images/contactModel.png"
          alt="3D cartoon scientist character with glasses, white lab coat, and purple tie"
          className="w-100 sm:w-60 md:w-[37vw] mb-8 md:mb-0 object-contain"
          style={{ maxHeight: '1800px' }}
        />
      </div>
  
      {/* Form - centered on mobile, proper positioning on desktop */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-lg space-y-5 px-0 md:px-6 md:ml-[-10vw]"
      >
        <h1 className="font-poppins text-4xl md:text-5xl font-bold text-black">Contact</h1>
  
        {/* Name fields - stack on small mobile, side by side otherwise */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="font-poppins-bold flex-1 border bg-transparent border-black rounded-md py-3 px-3 text-sm placeholder:text-sm"
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            value={formData.surname}
            onChange={handleChange}
            className="font-poppins-bold flex-1 border bg-transparent border-black rounded-md py-3 px-3 text-sm placeholder:text-sm"
            required
          />
        </div>
  
        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
          className="font-poppins-bold border bg-transparent border-black rounded-md py-3 px-3 text-sm placeholder:text-sm"
          required
        />
  
        <textarea
          name="query"
          placeholder="Query"
          rows={5}
          value={formData.query}
          onChange={handleChange}
          className="font-poppins-bold border bg-transparent border-black rounded-md py-4 px-4 text-sm placeholder:text-sm placeholder:font-poppins-bold resize-none"
          required
        />
  
        <button
          type="submit"
          className="w-32 border border-black rounded-full py-3 px-6 text-sm self-start hover:bg-black hover:text-white transition-colors duration-300"
        >
          Send
          <i className="fas fa-paper-plane ml-2"></i>
        </button>
      </form>
    </div>
  );
}

export default Contact;