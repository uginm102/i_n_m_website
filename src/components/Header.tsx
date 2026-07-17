export default function Header({content}: {content: string}) {
return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} {content}</p>
    </footer>
);
}