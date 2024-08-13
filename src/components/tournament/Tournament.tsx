export default function CategoryPlayers({
  players,
  handleInputChange,
  removeInputField,
  addInputField,
}: any) {
  return (
    <section style={{ marginTop: "16px" }}>
      <label>Կարգ լրացրած մասնակիցներ</label>

      {players.map((_: any, idx: any) => (
        <InputField
          key={idx}
          onChangePlayer={(e: any) => handleInputChange(idx, e, "player")}
          onChangeTrainer={(e: any) => handleInputChange(idx, e, "trainer")}
          removeItem={() => removeInputField(idx)}
          isPlayers={players.length > 0}
          values={players[idx]}
        />
      ))}
      <button onClick={addInputField}>+</button>
    </section>
  );
}

function InputField({
  onChangePlayer,
  onChangeTrainer,
  removeItem,
  isPlayers,
  values,
}: any) {
  return (
    <div>
      <input value={values.player} onChange={onChangePlayer} type="text" />
      <label>(մարզիչ՝ </label>
      <input value={values.trainer} onChange={onChangeTrainer} type="text" />
      {isPlayers && <button onClick={removeItem}>-</button>})
    </div>
  );
}
