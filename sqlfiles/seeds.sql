INSERT INTO department (name)
VALUES
  ('Management'),
  ('Sales'),
  ('CSR'),
  ('Service');


INSERT INTO role (title, salary, department_id)
VALUES
  ('Team Lead', 150000, 1),
  ('Sales Specialist', 75000, 2),
  ('Customer Service Representative', 60000, 3),
  ('Technician', 50000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Bill', 'Rice', 1, 4),
  ('Rodger', 'Huffman', 2, 3),
  ('Renee', 'Cauble', 3, 1),
  ('Taylor', 'Wood', 4, 5);