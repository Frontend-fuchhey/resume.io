import logoImg from '../assets/resume-io.png';

function Link({ to = '/', className, children, ...props }) {
  return (
    <a href={to} className={className} {...props}>
      {children}
    </a>
  );
}

export function Header({ onAboutOpen }) {
  return (
    <header className="flex items-center justify-between py-6">
      <Link className="flex items-center" to="/">
        <img 
          src={logoImg} 
          alt="resume.io" 
          className="h-8 w-auto object-contain hover:opacity-90 transition-opacity" 
        />
      </Link>
    </header>
  );
}

export default Header;
