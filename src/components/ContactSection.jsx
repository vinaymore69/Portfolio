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
    <div className="flex flex-col md:flex-row items-center max-w-4xl w-full mx-auto min-h-[100vh] justify-center space-x-0 px-4 py-8">
      <img
        src="./images/contactModel.png"
        alt="3D cartoon scientist character with glasses, white lab coat, and purple tie"
        className="w-[37vw] mb-12 object-contain"
        style={{ maxHeight: '800px' }}
      />
  
      <form
        onSubmit={handleSubmit}
        className="flex flex-col pl-[-10vw] ml-[-12vw] w-full max-w-lg space-y-5 px-6"
      >
        <h1 className="font-poppins text-5xl font-bold text-black">Contact</h1>
  
        <div className="flex gap-6">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="font-poppins-bold flex-1 border border-black rounded-md py-3 px-3 text-sm placeholder:text-sm"
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            value={formData.surname}
            onChange={handleChange}
            className="font-poppins-bold flex-1 border border-black rounded-md py-3 px-3 text-sm placeholder:text-sm"
            required
          />
        </div>
  
        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
          className="font-poppins-bold border border-black rounded-md py-3 px-3 text-sm placeholder:text-sm"
          required
        />
  
        <textarea
          name="query"
          placeholder="Query"
          rows={5}
          value={formData.query}
          onChange={handleChange}
          className="font-poppins-bold border border-black rounded-md py-4 px-4 text-sm placeholder:text-sm placeholder:font-poppins-bold resize-none"
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
