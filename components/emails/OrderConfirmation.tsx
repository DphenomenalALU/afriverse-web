import React from 'react';

interface OrderConfirmationProps {
  purchase: {
    shipping_address: {
      full_name: string;
      address_line1: string;
      address_line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
      phone: string;
    };
    total_amount: number;
    amount_saved: number;
  };
  listing: {
    title: string;
    images: string[];
  };
  buyerName: string;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ purchase, listing, buyerName }) => {
  const logoUrl = 'https://afriverse-web-nine.vercel.app/images/afriverse-logo.png';
  const primaryColor = '#10b981'; // emerald-500
  const secondaryColor = '#22c55e'; // green-500
  const textColor = '#1f2937'; // gray-800

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: textColor, maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#ffffff' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img src={logoUrl} alt='Afriverse' style={{ maxWidth: '200px', margin: '0 auto' }} />
      </div>
      
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: primaryColor, textAlign: 'center', marginBottom: '20px' }}>
        Thank You for Your Purchase, {buyerName}!
      </h1>
      
      <p style={{ fontSize: '16px', marginBottom: '20px', textAlign: 'center' }}>
        Your order has been successfully placed and is being shipped to you.
      </p>
      
      <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: secondaryColor, marginBottom: '15px' }}>Order Details</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span>Item:</span>
          <span style={{ fontWeight: 'bold' }}>{listing.title}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span>Total Amount:</span>
          <span style={{ fontWeight: 'bold' }}>${purchase.total_amount.toFixed(2)}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span>Amount Saved:</span>
          <span style={{ fontWeight: 'bold', color: secondaryColor }}>${purchase.amount_saved.toFixed(2)}</span>
        </div>
        
        {listing.images[0] && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src={listing.images[0]} alt={listing.title} style={{ maxWidth: '200px', borderRadius: '8px', margin: '0 auto' }} />
          </div>
        )}
      </div>
      
      <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: secondaryColor, marginBottom: '15px' }}>Shipping Address</h2>
        
        <p>{purchase.shipping_address.full_name}</p>
        <p>{purchase.shipping_address.address_line1}</p>
        {purchase.shipping_address.address_line2 && <p>{purchase.shipping_address.address_line2}</p>}
        <p>{purchase.shipping_address.city}, {purchase.shipping_address.state} {purchase.shipping_address.postal_code}</p>
        <p>{purchase.shipping_address.country}</p>
        <p>Phone: {purchase.shipping_address.phone}</p>
      </div>
      
      <p style={{ fontSize: '14px', textAlign: 'center', color: '#6b7280' }}>
        If you have any questions, contact us at support@afriverse.com
      </p>
    </div>
  );
}; 