export default function Footer({content}: {content: string}) {
return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} {content}</p>
    </footer>
);
}