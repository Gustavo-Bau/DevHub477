export default function QuantityControl({ quantity, onChange }) {
  return (
    <div className='quantity-control'>
      <button type='button' onClick={() => onChange(Math.max(1, quantity - 1))} aria-label='Diminuir quantidade'>-</button>
      <span>{quantity}</span>
      <button type='button' onClick={() => onChange(quantity + 1)} aria-label='Aumentar quantidade'>+</button>
    </div>
  );
}
