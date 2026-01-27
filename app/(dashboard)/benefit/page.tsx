"use client";

import { useState } from "react";

export default function EmployeePage() {
  const [showForm, setShowForm] = useState(true); // form visible by default
  const [cvPreview, setCvPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFilePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCvPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.target as HTMLFormElement);
    console.log("Saving Employee:", Object.fromEntries(formData));

    setTimeout(() => {
      setSaving(false);
      alert("Employee created successfully ✅");
      setShowForm(false);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen p-6 font-sans bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6 text-center" style={{ color: "#154667" }}>
        Employee Management
      </h1>

      {/* CREATE BUTTON */}
      {!showForm && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 rounded-xl text-white"
            style={{ backgroundColor: "#154667" }}
          >
            + Create Employee
          </button>
        </div>
      )}

      {/* EMPLOYEE FORM */}
      {showForm && (
        <div className="mt-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-semibold" style={{ color: "#154667" }}>
              Create Employee
            </h1>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl border"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="pb-32 space-y-6">
            {/* RESPONSIVE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <Section title="Personal Information">
                <Grid>
                  <Input name="firstName" label="First Name" required />
                  <Input name="lastName" label="Last Name" required />
                  <Input name="otherNames" label="Other Names" />
                  <Input name="email" label="Email" type="email" required />
                  <Input name="phone" label="Phone Number" required />
                  <Input name="dob" label="Date of Birth" type="date" />
                  <Select name="gender" label="Gender">
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </Select>
                  <Input name="address" label="Residential Address" />
                </Grid>
              </Section>

              <Section title="Employment Details">
                <Grid>
                  <Input name="employeeId" label="Employee ID" required />
                  <Input name="jobTitle" label="Job Title" required />
                  <Input name="department" label="Department" />
                  <Select name="employmentType" label="Employment Type">
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract</option>
                  </Select>
                  <Input name="hireDate" label="Hire Date" type="date" />
                  <Select name="status" label="Employment Status">
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Suspended</option>
                  </Select>
                </Grid>
              </Section>

              <Section title="Payroll Information">
                <Grid>
                  <Input name="basicSalary" label="Basic Salary" type="number" />
                  <Select name="salaryType" label="Salary Type">
                    <option>Monthly</option>
                    <option>Hourly</option>
                  </Select>
                  <Input name="allowances" label="Allowances" type="number" />
                  <Input name="taxNumber" label="Tax ID / TIN" />
                  <Input name="ssnit" label="SSNIT Number" />
                </Grid>
              </Section>

              <Section title="Bank & Payment">
                <Grid>
                  <Input name="bankName" label="Bank Name" required />
                  <Input name="accountName" label="Account Name" required />
                  <Input name="accountNumber" label="Account Number" required />
                  <Select name="paymentMethod" label="Payment Method">
                    <option>Bank Transfer</option>
                    <option>Mobile Money</option>
                  </Select>
                </Grid>
              </Section>

              <Section title="Emergency Contact">
                <Grid>
                  <Input name="emergencyName" label="Contact Name" />
                  <Input name="emergencyPhone" label="Contact Phone" />
                  <Input name="relationship" label="Relationship" />
                  <Select name="contactCategory" label="Contact Category">
                    <option>Emergency</option>
                    <option>Next of Kin</option>
                    <option>Dependent</option>
                  </Select>
                </Grid>
              </Section>

              <Section title="Documents">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Upload CV</label>
                    <input
                      type="file"
                      name="cv"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFilePreview}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Upload ID</label>
                    <input type="file" name="idCard" accept=".png,.jpg,.pdf" />
                  </div>

                  {cvPreview && (
                    <iframe
                      src={cvPreview}
                      className="w-full h-48 rounded-xl border"
                    />
                  )}
                </div>
              </Section>
            </div>

            {/* STICKY SAVE BAR */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-4 flex justify-end gap-4 z-50">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl border"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-xl text-white"
                style={{ backgroundColor: "#154667" }}
              >
                {saving ? "Saving..." : "Save Employee"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

const Section = ({ title, children }: any) => (
  <section className="bg-white p-6 rounded-2xl shadow h-fit">
    <h2 className="text-lg font-medium mb-4" style={{ color: "#154667" }}>
      {title}
    </h2>
    {children}
  </section>
);

const Grid = ({ children }: any) => (
  <div className="grid grid-cols-1 gap-4">{children}</div>
);

const Input = ({ label, ...props }: any) => (
  <div>
    <label className="block text-sm mb-1" style={{ color: "#154667" }}>
      {label}
    </label>
    <input {...props} className="w-full border rounded-xl px-3 py-2" />
  </div>
);

const Select = ({ label, children, ...props }: any) => (
  <div>
    <label className="block text-sm mb-1" style={{ color: "#154667" }}>
      {label}
    </label>
    <select {...props} className="w-full border rounded-xl px-3 py-2">
      {children}
    </select>
  </div>
);
