type ButtonProps = {
    label: string;
    type?: 'button' | 'submit' | 'reset';
  };
  
  export default function Button({ label, type }: ButtonProps) {
    return (
      <button className="button" type={type}>
        {label}
      </button>
    );
  }
  