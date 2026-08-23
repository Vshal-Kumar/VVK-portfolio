import React, { useState } from 'react';
import { Send } from 'lucide-react';
import AnimatedContent from './AnimatedContent';

export default function Contact({ onShowToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '' // honeypot
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validateField = (field, value) => {
    const val = value.trim();
    let err = '';
    switch (field) {
      case 'name':
        if (val.length < 2) err = 'Name must be at least 2 characters.';
        break;
      case 'email':
        if (!isEmail(val)) err = 'Please enter a valid email address.';
        break;
      case 'subject':
        if (val.length < 3) err = 'Subject must be at least 3 characters.';
        break;
      case 'message':
        if (val.length < 15) err = 'Message must be at least 15 characters.';
        break;
      default:
        break;
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name !== 'website') {
      const err = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot trap check
    if (formData.website) {
      onShowToast('success', 'Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '', website: '' });
      setErrors({ name: '', email: '', subject: '', message: '' });
      return;
    }

    // Comprehensive validation
    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const subjectErr = validateField('subject', formData.subject);
    const messageErr = validateField('message', formData.message);

    setErrors({
      name: nameErr,
      email: emailErr,
      subject: subjectErr,
      message: messageErr
    });

    if (nameErr || emailErr || subjectErr || messageErr) {
      return;
    }

    setIsSubmitting(true);

    const apiBase = import.meta.env.VITE_API_URL || '';
    const endpoint = `${apiBase}/send_email`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim()
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        onShowToast('success', data.message || 'Message sent successfully!');
        setFormData({ name: '', email: '', subject: '', message: '', website: '' });
        setErrors({ name: '', email: '', subject: '', message: '' });
      } else {
        onShowToast('error', data.message || 'Failed to send message.');
      }
    } catch (err) {
      onShowToast('error', 'Network error. Please try emailing directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <AnimatedContent distance={35} direction="vertical" duration={0.8} threshold={0.15}>
        <div className="section-tag">Contact</div>
        <h2 className="section-heading">
          Let's <em>Connect</em>
        </h2>
        <p className="section-sub">
          Whether you have a project in mind, want to collaborate, or just want to say hi — feel free to reach out! I'm always open to new opportunities and connections.
        </p>
      </AnimatedContent>

      <div className="contact-grid">
        <div className="contact-form-wrap">
          <AnimatedContent distance={45} direction="vertical" duration={0.85} delay={0.1} threshold={0.12}>
            <form id="contactForm" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ borderColor: errors.name ? 'rgba(224,112,112,.5)' : '' }}
                    required
                  />
                  <span className="field-error" id="nameError">
                    {errors.name}
                  </span>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ borderColor: errors.email ? 'rgba(224,112,112,.5)' : '' }}
                    required
                  />
                  <span className="field-error" id="emailError">
                    {errors.email}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="Project Collaboration"
                  value={formData.subject}
                  onChange={handleChange}
                  style={{ borderColor: errors.subject ? 'rgba(224,112,112,.5)' : '' }}
                  required
                />
                <span className="field-error" id="subjectError">
                  {errors.subject}
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  style={{ borderColor: errors.message ? 'rgba(224,112,112,.5)' : '' }}
                  required
                ></textarea>
                <span className="field-error" id="messageError">
                  {errors.message}
                </span>
              </div>

              {/* Hidden Honeypot Field */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />

              <button
                type="submit"
                className="btn-solid btn-submit"
                id="submitBtn"
                disabled={isSubmitting}
              >
                <span id="submitText">
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </span>
                <Send size={15} strokeWidth={1.8} id="submitIcon" />
              </button>
            </form>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
