update public.sessions
set description = case "order"
  when 1 then 'Start small. You do not need a full life assessment here, only an honest snapshot of how things feel lately.'
  when 2 then 'Notice the thoughts or themes that have been showing up most lately. A few simple observations are enough.'
  when 3 then 'Think gently about what tends to leave you feeling drained, flat, or less like yourself.'
  when 4 then 'Think about what tends to leave you feeling lighter, clearer, or more like yourself.'
  when 5 then 'Look for the moments, places, or habits that help your body and mind settle, even a little.'
  when 6 then 'Reflect on the moments where you feel capable, steady, or more trusting of yourself.'
  when 7 then 'Gather what you have noticed so far, even if it still feels small, early, or unfinished.'
  when 8 then 'Name the concerns, loops, or responsibilities that have been taking up the most room in your mind.'
  else description
end
where program_id = 'foundation-30'
  and "order" in (1, 2, 3, 4, 5, 6, 7, 8);
