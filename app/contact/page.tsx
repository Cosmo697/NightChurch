'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Sending...');

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setStatus('Message sent!');
      setFormData({ name: '', email: '', message: '' });
    } else {
      const err = await res.json();
      setStatus('Error: ' + err.error);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Card>
        <CardContent className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-center">Contact Us</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Your Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Your Email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <textarea
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Your Message"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              required
              rows={5}
            />
            <Button type="submit" className="w-full">
              Send
            </Button>
            <p className="text-sm text-center text-gray-600">{status}</p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
