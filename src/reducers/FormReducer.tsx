export function FormReducer(
  state: Record<string, string>,
  event: React.ChangeEvent<HTMLInputElement>
) {
  return {
    ...state,
    [event.target.name]: event.target.value,
  };
}
