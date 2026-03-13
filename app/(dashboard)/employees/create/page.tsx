"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CreateEmployeePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data States matching API structure
  const [employeeData, setEmployeeData] = useState({
    // Employee (POST Create Employee)
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });

  const [profilePicture, setProfilePicture] = useState({
    file: null,
    preview: null,
  });

  const [errors, setErrors] = useState({
    profilePicture: false,
    step1: false,
    step2: false,
    step3: false,
  });

  // Base color palette
  const colors = {
    primary: '#2c4a6a',      // Base navy blue
    primaryDark: '#1e3147',  // Dark navy
    primaryDarker: '#0f1a2a', // Darker navy
    primaryMid: '#4a6b82',   // Medium navy
    primaryLight: '#6b8ca3', // Light navy
    primaryLighter: '#8badc3', // Lighter navy
    accent: '#a3c2d7',       // Accent blue
    accentLight: '#c3d2e9',  // Light accent
    bgLight: '#dbe7f1',      // Very light blue bg
    bgLighter: '#e8f0f7',    // Ultra light blue bg
  };

  const [employeeDetails, setEmployeeDetails] = useState({
    // Employee Details (POST Create employee details)
    employeeId: "", // Will be generated from employee creation
    jobTitle: "",
    department: "",
    employmentType: "",
    hireDate: "",
    employmentStatus: "Active",
    basicSalary: "",
    taxId: "",
    ssnitNumber: "",
  });

  const [bankAccount, setBankAccount] = useState({
    // Bank Accounts (POST Create bank account detail)
    employeeId: "", // Will link to created employee
    bankName: "",
    accountNumber: "",
    accountName: "",
    branchName: "",
    swiftCode: "",
  });

  const [contact, setContact] = useState({
    // Contacts (POST Create new Contact)
    employeeId: "", // Will link to created employee
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    relationship: "",
    address: "",
    isEmergency: true,
  });

  const steps = [
    { number: 1, name: "Employee Info", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { number: 2, name: "Employment Details", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { number: 3, name: "Bank Account", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { number: 4, name: "Emergency Contact", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
  ];

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture({
          file: file,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture({
      file: null,
      preview: null,
    });
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankAccount(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContact(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleNext = () => {
    // Reset errors
    setErrors({
      profilePicture: false,
      step1: false,
      step2: false,
      step3: false,
    });

    // Validate Step 1: Employee Info + Profile Picture
    if (currentStep === 1) {
      let hasError = false;
      
      if (!profilePicture.file) {
        setErrors(prev => ({ ...prev, profilePicture: true }));
        hasError = true;
      }
      
      if (!employeeData.firstName || !employeeData.lastName || !employeeData.email || 
          !employeeData.phone || !employeeData.dateOfBirth || !employeeData.gender || 
          !employeeData.address) {
        setErrors(prev => ({ ...prev, step1: true }));
        hasError = true;
      }

      if (hasError) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // Validate Step 2: Employment Details
    if (currentStep === 2) {
      if (!employeeDetails.jobTitle || !employeeDetails.department || 
          !employeeDetails.employmentType || !employeeDetails.hireDate || 
          !employeeDetails.employmentStatus || !employeeDetails.basicSalary || 
          !employeeDetails.taxId || !employeeDetails.ssnitNumber) {
        setErrors(prev => ({ ...prev, step2: true }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // Validate Step 3: Bank Account
    if (currentStep === 3) {
      if (!bankAccount.bankName || !bankAccount.accountNumber || !bankAccount.accountName) {
        setErrors(prev => ({ ...prev, step3: true }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: POST Create Employee
      console.log("POST /api/employee - Create Employee", employeeData);
      console.log("Profile Picture:", profilePicture.file);
      
      // If you need to upload the image to a server:
      // const formData = new FormData();
      // formData.append('profilePicture', profilePicture.file);
      // Object.keys(employeeData).forEach(key => {
      //   formData.append(key, employeeData[key]);
      // });
      
      // const employeeResponse = await fetch('/api/employee', {
      //   method: 'POST',
      //   body: formData // Send as FormData for file upload
      // });
      // const newEmployee = await employeeResponse.json();
      
      const newEmployeeId = "EMP" + Date.now(); // Simulated

      // Step 2: POST Create employee details
      console.log("POST /api/employee-details - Create employee details", {
        ...employeeDetails,
        employeeId: newEmployeeId
      });

      // Step 3: POST Create bank account detail
      console.log("POST /api/bank-accounts - Create bank account detail", {
        ...bankAccount,
        employeeId: newEmployeeId
      });

      // Step 4: POST Create new Contact
      console.log("POST /api/contacts - Create new Contact", {
        ...contact,
        employeeId: newEmployeeId
      });

      // Success
      alert("Employee created successfully!");
      setTimeout(() => {
        router.push("/employees");
      }, 1500);

    } catch (error) {
      console.error("Error creating employee:", error);
      alert("Failed to create employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gradient-to-br hover:from-[#dbe7f1] hover:to-[#e8f0f7] rounded-lg transition-all border border-gray-200 hover:border-[#8badc3]"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Employee</h1>
            <p className="text-sm text-gray-600 mt-1">Add a new employee to the system</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= step.number
                    ? 'bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} />
                    </svg>
                  )}
                </div>
                <p className={`text-xs mt-2 font-medium hidden sm:block ${
                  currentStep >= step.number ? 'text-[#2c4a6a]' : 'text-gray-500'
                }`}>
                  {step.name}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                  currentStep > step.number ? 'bg-gradient-to-r from-[#2c4a6a] to-[#1e3147]' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl p-6 md:p-8 mb-6">
          
          {/* Step 1: Employee Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Employee Information</h2>
                  <p className="text-sm text-gray-600">Basic personal details of the employee</p>
                </div>
              </div>

              {/* Profile Picture Upload */}
              <div className={`flex flex-col items-center py-6 border-2 border-dashed rounded-xl transition-all ${errors.profilePicture && !profilePicture.file ? 'border-[#4a6b82] bg-gradient-to-br from-[#dbe7f1] to-[#e8f0f7]' : 'border-gray-300 bg-gray-50'}`}>
                <label className="text-sm font-medium text-gray-900 mb-2">
                  Profile Picture <span className="text-[#2c4a6a] font-bold">*</span>
                </label>
                <p className="text-xs text-gray-600 mb-4">Required - Please upload a professional photo</p>
                
                {errors.profilePicture && !profilePicture.file && (
                  <div className="mb-4 px-4 py-3 bg-gradient-to-r from-[#dbe7f1] to-[#e8f0f7] border-2 border-[#4a6b82] rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-sm text-[#1e3147] font-semibold">Profile picture is required to proceed to the next step</span>
                  </div>
                )}
                
                <div className="relative">
                  {profilePicture.preview ? (
                    <div className="relative">
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#2c4a6a]/30 ring-4 ring-[#8badc3]/30">
                        <Image
                          src={profilePicture.preview}
                          alt="Profile preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeProfilePicture}
                          className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-[#4a6b82] to-[#2c4a6a] hover:from-[#2c4a6a] hover:to-[#1e3147] text-white rounded-full flex items-center justify-center transition-all z-10"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Uploaded
                      </div>
                    </div>
                  ) : (
                    <label className={`w-32 h-32 rounded-full border-4 border-dashed ${errors.profilePicture ? 'border-[#4a6b82] bg-gradient-to-br from-[#dbe7f1] to-[#e8f0f7]' : 'border-[#8badc3] bg-gradient-to-br from-white to-gray-50'} hover:border-[#2c4a6a] hover:bg-gradient-to-br hover:from-[#dbe7f1] hover:to-[#e8f0f7] flex flex-col items-center justify-center cursor-pointer transition-all`}>
                      <svg className={`w-10 h-10 ${errors.profilePicture ? 'text-[#2c4a6a]' : 'text-[#6b8ca3]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className={`text-xs mt-2 font-bold ${errors.profilePicture ? 'text-[#2c4a6a]' : 'text-[#4a6b82]'}`}>Upload Photo</span>
                      <span className="text-xs text-gray-500 mt-1">Required</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-4 text-center max-w-xs">
                  Supported formats: <span className="font-semibold text-[#2c4a6a]">JPEG, PNG, GIF, WebP</span> (Max 5MB)
                </p>
              </div>

              {errors.step1 && (
                <div className="px-5 py-4 bg-gradient-to-r from-[#dbe7f1] to-[#e8f0f7] border-2 border-[#4a6b82] rounded-xl flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#1e3147] font-bold mb-1">Please complete all required fields</p>
                    <p className="text-xs text-[#2c4a6a]">All fields marked with <span className="font-bold">*</span> are required to proceed to the next step.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-[#2c4a6a] font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={employeeData.firstName}
                    onChange={handleEmployeeChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={employeeData.lastName}
                    onChange={handleEmployeeChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={employeeData.email}
                    onChange={handleEmployeeChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="employee@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={employeeData.phone}
                    onChange={handleEmployeeChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={employeeData.dateOfBirth}
                    onChange={handleEmployeeChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <select
                    name="gender"
                    value={employeeData.gender}
                    onChange={handleEmployeeChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Residential Address <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <textarea
                    name="address"
                    value={employeeData.address}
                    onChange={handleEmployeeChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="Enter full residential address"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Employment Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Employment Details</h2>
                  <p className="text-sm text-gray-600">Job information and employment terms</p>
                </div>
              </div>

              {errors.step2 && (
                <div className="px-5 py-4 bg-gradient-to-r from-[#dbe7f1] to-[#e8f0f7] border-2 border-[#4a6b82] rounded-xl flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#1e3147] font-bold mb-1">Please complete all required employment details</p>
                    <p className="text-xs text-[#2c4a6a]">All fields marked with <span className="font-bold">*</span> must be filled in before proceeding.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={employeeDetails.jobTitle}
                    onChange={handleDetailsChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="e.g. Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <select
                    name="department"
                    value={employeeDetails.department}
                    onChange={handleDetailsChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all bg-white"
                  >
                    <option value="">Select Department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Management">Management</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Support">Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <select
                    name="employmentType"
                    value={employeeDetails.employmentType}
                    onChange={handleDetailsChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all bg-white"
                  >
                    <option value="">Select Type</option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hire Date <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <input
                    type="date"
                    name="hireDate"
                    value={employeeDetails.hireDate}
                    onChange={handleDetailsChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Status <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <select
                    name="employmentStatus"
                    value={employeeDetails.employmentStatus}
                    onChange={handleDetailsChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Terminated">Terminated</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Basic Salary (₵) <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <input
                    type="number"
                    name="basicSalary"
                    value={employeeDetails.basicSalary}
                    onChange={handleDetailsChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax ID / TIN <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={employeeDetails.taxId}
                    onChange={handleDetailsChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="Enter Tax ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SSNIT Number <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <input
                    type="text"
                    name="ssnitNumber"
                    value={employeeDetails.ssnitNumber}
                    onChange={handleDetailsChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="Enter SSNIT Number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Bank Account */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Bank Account Details</h2>
                  <p className="text-sm text-gray-600">Payment and banking information</p>
                </div>
              </div>

              {errors.step3 && (
                <div className="px-5 py-4 bg-gradient-to-r from-[#dbe7f1] to-[#e8f0f7] border-2 border-[#4a6b82] rounded-xl flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-[#1e3147] font-bold mb-1">Please complete all required bank account details</p>
                    <p className="text-xs text-[#2c4a6a]">Bank Name, Account Number, and Account Name are required fields.</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={bankAccount.bankName}
                    onChange={handleBankChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="e.g. GCB Bank"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={bankAccount.accountNumber}
                    onChange={handleBankChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="Enter account number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <input
                    type="text"
                    name="accountName"
                    value={bankAccount.accountName}
                    onChange={handleBankChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="Name as it appears on account"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    name="branchName"
                    value={bankAccount.branchName}
                    onChange={handleBankChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="e.g. Accra Main Branch"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SWIFT Code / Sort Code
                  </label>
                  <input
                    type="text"
                    name="swiftCode"
                    value={bankAccount.swiftCode}
                    onChange={handleBankChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="Enter SWIFT/Sort Code if applicable"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Emergency Contact */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Emergency Contact</h2>
                  <p className="text-sm text-gray-600">Contact person in case of emergency</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={contact.contactName}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={contact.contactPhone}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={contact.contactEmail}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="contact@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship <span className="text-[#2c4a6a] font-bold">**</span>
                  </label>
                  <select
                    name="relationship"
                    value={contact.relationship}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all bg-white"
                  >
                    <option value="">Select Relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Child">Child</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Address
                  </label>
                  <textarea
                    name="address"
                    value={contact.address}
                    onChange={handleContactChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a] focus:border-[#2c4a6a] transition-all"
                    placeholder="Enter contact's address"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#dbe7f1] to-[#e8f0f7] rounded-xl border-2 border-[#8badc3] hover:border-[#4a6b82] cursor-pointer transition-all">
                    <input
                      type="checkbox"
                      name="isEmergency"
                      checked={contact.isEmergency}
                      onChange={handleContactChange}
                      className="w-5 h-5 text-[#2c4a6a] rounded focus:ring-2 focus:ring-[#2c4a6a] border-[#4a6b82]"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#1e3147]">Mark as Emergency Contact</p>
                      <p className="text-xs text-[#2c4a6a] mt-1">This contact will be notified in case of emergencies</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl p-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 border-2 border-[#8badc3] hover:border-[#4a6b82] rounded-lg text-sm font-medium text-[#2c4a6a] hover:bg-gradient-to-br hover:from-[#dbe7f1] hover:to-[#e8f0f7] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border-2 border-[#8badc3] hover:border-[#4a6b82] rounded-lg text-sm font-medium text-[#2c4a6a] hover:bg-gradient-to-br hover:from-[#dbe7f1] hover:to-[#e8f0f7] transition-all"
            >
              Cancel
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Employee
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}