export default function TextForCopy({ text }: { text: string }) {
  return (
    <div className="final_container">
      {/* <div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(text);
          }}
        >
          📄
        </button>
      </div> */}
      {text}
    </div>
  );
}
