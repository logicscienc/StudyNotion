import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitContactForm = async (data) => {
    console.log("Logging Data", data);
    try{

    }
    catch(error){

    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);
  return (
    <form onSubmit={handleSubmit(submitContactForm)}>
      <div className="flex flex-col gap-14">
        <div className="flex gap-5">
          {/* firstName */}
          <div className="flex flex-col">
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              className="text-black"
              placeholder="Enter first name"
              {...register("firstname", { required: true })}
            />
            {errors.firstname && <span>Please enter Your name</span>}
          </div>
          {/* last name */}
          <div className="flex flex-col">
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              name="lastname"
              id="lastname"
               className="text-black"
              placeholder="Enter last name"
              {...register("lastname")}
            />
          </div>
        </div>
        {/* email */}
        <div className="flex flex-col">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
             className="text-black"
            placeholder="Enter email Address"
            {...register("email", { required: true })}
          />

          {errors.email && <span>Please enter your email address</span>}
        </div>

        {/* message */}
        <div className="flex flex-col">
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
             className="text-black"
            cols="30"
            rows="7"
            placeholder="Enter your message here"
            {...register("message", { required: true })}
          />

          {errors.message && <span>Please enter your message.</span>}
        </div>

        <button type="submit"
        className="rounded-md bg-yellow-50 text-center px-6 text-[16px] text-black"
        >
            Send Message
        </button>
      </div>
    </form>
  );
};

export default ContactUsForm;
