update public.sessions
set description = case "order"
  when 1 then 'Start simple. Write a few honest lines about how life feels lately, without trying to solve everything.'
  when 2 then 'Notice the thoughts, worries, or themes that have been taking up space recently.'
  when 3 then 'Think about the people, tasks, or patterns that leave you feeling flatter or more depleted.'
  when 4 then 'Think about what helps you feel lighter, clearer, or more like yourself.'
  when 5 then 'Look for the moments, places, or habits that make your body and mind slow down a little.'
  when 7 then 'Gather what you have noticed so far, even if it feels small or unfinished.'
  else description
end
where program_id = 'foundation-30'
  and "order" in (1, 2, 3, 4, 5, 7);
