import React from 'react';

interface OrderConfirmationProps {
  purchase: {
    id: string;
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
  buyerEmail: string; 
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ purchase, listing, buyerName, buyerEmail }) => {
  const logoUrl = 'https://afriversee.vercel.app/images/afriverse-logo.png';
  const primaryColor = '#10b981';
  const secondaryColor = '#22c55e';
  const textColor = '#1f2937';
  const bgColor = '#f9fafb';
  const sectionBg = '#ffffff';

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", color: textColor, backgroundColor: bgColor, padding: '40px 20px' }}>
      <table cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: sectionBg, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <tr>
          <td style={{ padding: '30px 40px', textAlign: 'center', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
            <img src={logoUrl} alt="Afriverse" style={{ maxWidth: '180px', margin: '0 auto' }} />
          </td>
        </tr>
        <tr>
          <td style={{ padding: '40px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: primaryColor, textAlign: 'center', marginBottom: '20px' }}>
              Thank You for Your Purchase, {buyerName}!
            </h1>
            <p style={{ fontSize: '16px', lineHeight: '1.5', textAlign: 'center', marginBottom: '30px' }}>
              Your order has been successfully placed and is on its way. We're excited for you to receive your sustainable fashion find!
            </p>

            <table cellPadding="0" cellSpacing="0" style={{ width: '100%', backgroundColor: '#f3f4f6', borderRadius: '8px', marginBottom: '30px', padding: '20px' }}>
              <tr>
                <td>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: secondaryColor, marginBottom: '15px' }}>Order Details</h2>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <table style={{ width: '100%' }}>
                    <tr>
                      <td>Item:</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{listing.title}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <table style={{ width: '100%' }}>
                    <tr>
                      <td>Total Amount:</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>${purchase.total_amount.toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0' }}>
                  <table style={{ width: '100%' }}>
                    <tr>
                      <td>Amount Saved:</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: secondaryColor }}>${purchase.amount_saved.toFixed(2)}</td>
                    </tr>
                  </table>
                </td>
              </tr>
              {listing.images[0] && (
                <tr>
                  <td style={{ textAlign: 'center', padding: '20px 0' }}>
                    <img src={listing.images[0]} alt={listing.title} style={{ maxWidth: '250px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                  </td>
                </tr>
              )}
            </table>

            <table cellPadding="0" cellSpacing="0" style={{ width: '100%', backgroundColor: '#f3f4f6', borderRadius: '8px', marginBottom: '30px', padding: '20px' }}>
              <tr>
                <td>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: secondaryColor, marginBottom: '15px' }}>Shipping Address</h2>
                </td>
              </tr>
              <tr>
                <td style={{ fontSize: '16px', lineHeight: '1.5' }}>
                  <p>{purchase.shipping_address.full_name}</p>
                  <p>{purchase.shipping_address.address_line1}</p>
                  {purchase.shipping_address.address_line2 && <p>{purchase.shipping_address.address_line2}</p>}
                  <p>{purchase.shipping_address.city}, {purchase.shipping_address.state} {purchase.shipping_address.postal_code}</p>
                  <p>{purchase.shipping_address.country}</p>
                  {purchase.shipping_address.phone && <p style={{ marginTop: '10px' }}>Phone: {purchase.shipping_address.phone}</p>}
                </td>
              </tr>
            </table>

            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <a href="https://afriversee.vercel.app/profile" style={{ backgroundColor: primaryColor, color: '#ffffff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>
                View Your Orders
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style={{ padding: '20px 40px', backgroundColor: '#f3f4f6', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
            <p>If you have any questions, contact us at <a href="mailto:support@afriverse.com" style={{ color: primaryColor, textDecoration: 'none' }}>support@afriverse.com</a></p>
            <p style={{ marginTop: '10px' }}><a href={`https://afriversee.vercel.app/unsubscribe?email=${encodeURIComponent(buyerEmail)}`} style={{ color: '#6b7280', textDecoration: 'underline' }}>Unsubscribe</a> | Afriverse © {new Date().getFullYear()}</p>
          </td>
        </tr>
      </table>
    </div>
  );
}; 