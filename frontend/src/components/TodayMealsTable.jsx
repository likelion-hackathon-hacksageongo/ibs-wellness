const mealTypes = [
  ["breakfast", "아침"],
  ["lunch", "점심"],
  ["dinner", "저녁"],
  ["snack", "간식"],
];

const portionLabels = { small: "소량", medium: "보통", large: "많음" };
const comfortLabels = {
  comfortable: "편안함",
  slightly_uncomfortable: "약간 불편함",
  very_uncomfortable: "많이 불편함",
};

export default function TodayMealsTable({ records, onEdit, onDelete, onCondition }) {
  const today = new Date().toDateString();
  const todayRecords = records.filter(
    (record) => new Date(record.meal_time).toDateString() === today,
  );

  return (
    <section className="today-meals" aria-labelledby="today-meals-title">
      <h2 id="today-meals-title">오늘의 식사</h2>
      <div className="today-meals-table" role="table">
        {mealTypes.map(([type, label]) => {
          const record = todayRecords.find((item) => item.meal_type === type);
          return (
            <div className="today-meals-row" role="row" key={type}>
              <strong role="cell">{label}</strong>
              {record ? (
                <>
                  <span role="cell">{record.menu_name}</span>
                  <span role="cell">{portionLabels[record.portion_size]}</span>
                  <span role="cell">
                    {record.condition
                      ? comfortLabels[record.condition.comfort_level]
                      : "상태 미기록"}
                  </span>
                  <div className="today-meal-actions">
                    <button type="button" onClick={() => onEdit(record)}>수정</button>
                    <button type="button" onClick={() => onDelete(record)}>삭제</button>
                    <button type="button" onClick={() => onCondition(record)}>{record.condition ? "상태 수정" : "상태 기록"}</button>
                  </div>
                </>
              ) : (
                <span className="empty" role="cell">
                  기록 없음
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
