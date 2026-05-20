import db from "#/db/db";

const dummyDepartmentsName: string[] = [
  "Human Resources",
  "Information Technology",
  "Finance",
  "Marketing",
  "Sales",
  "Research & Development",
  "Customer Support",
  "Operations",
  "Legal",
  "Supply Chain",
];

const dummyEmployees: { employee_name: string; department_id: number }[] = [
  { employee_name: "Bendicty King", department_id: 9 },
  { employee_name: "Howey Harvard", department_id: 7 },
  { employee_name: "Yasmin Mains", department_id: 3 },
  { employee_name: "Zora Solland", department_id: 1 },
  { employee_name: "Karie Christene", department_id: 7 },
  { employee_name: "Kassi Novik", department_id: 3 },
  { employee_name: "Aguste Knatt", department_id: 6 },
  { employee_name: "Irene Latter", department_id: 3 },
  { employee_name: "Lothario Bart", department_id: 4 },
  { employee_name: "Dita Murtell", department_id: 7 },
  { employee_name: "Rowen Scanes", department_id: 1 },
  { employee_name: "Stewart Agastina", department_id: 8 },
  { employee_name: "Violette Caffrey", department_id: 7 },
  { employee_name: "Gael Scaysbrook", department_id: 1 },
  { employee_name: "Ravid Cesconi", department_id: 9 },
  { employee_name: "Cherice Fairrie", department_id: 4 },
  { employee_name: "Cloris Fortesquieu", department_id: 7 },
  { employee_name: "Luce Courtney", department_id: 7 },
  { employee_name: "Tiffanie Reynold", department_id: 6 },
  { employee_name: "Elston Crisp", department_id: 8 },
  { employee_name: "Jonah McLewd", department_id: 2 },
  { employee_name: "Jackie Close", department_id: 5 },
  { employee_name: "Arri Bowhay", department_id: 2 },
  { employee_name: "Sonja Rowley", department_id: 4 },
  { employee_name: "Karen De Ruel", department_id: 3 },
  { employee_name: "Sammie Alliker", department_id: 3 },
  { employee_name: "Kincaid Quigley", department_id: 3 },
  { employee_name: "Kaylil Attrie", department_id: 8 },
  { employee_name: "Edeline Wilkin", department_id: 6 },
  { employee_name: "Brena Showl", department_id: 9 },
  { employee_name: "Yance Pudsall", department_id: 7 },
  { employee_name: "Angy Toombs", department_id: 4 },
  { employee_name: "Bruce Hukins", department_id: 5 },
  { employee_name: "Dari Laweles", department_id: 1 },
  { employee_name: "Ladonna Goosnell", department_id: 3 },
  { employee_name: "Hamlen Eamer", department_id: 4 },
  { employee_name: "Drucy Stracey", department_id: 3 },
  { employee_name: "Maddalena Lavender", department_id: 7 },
  { employee_name: "Cynthia Piscot", department_id: 8 },
  { employee_name: "Ursulina Maycock", department_id: 8 },
  { employee_name: "Malissia Shilburne", department_id: 9 },
  { employee_name: "Steward Varey", department_id: 8 },
  { employee_name: "Russ Duddy", department_id: 1 },
  { employee_name: "Fields Paradise", department_id: 7 },
  { employee_name: "Vanessa Sutor", department_id: 3 },
  { employee_name: "Serge Senescall", department_id: 4 },
  { employee_name: "Teriann Emps", department_id: 9 },
  { employee_name: "Teri Yashaev", department_id: 2 },
  { employee_name: "Filippo Buttner", department_id: 3 },
  { employee_name: "Johann Vasilischev", department_id: 2 },
  { employee_name: "Morly Hartless", department_id: 2 },
  { employee_name: "Florenza Corradini", department_id: 4 },
  { employee_name: "Danella Braga", department_id: 3 },
  { employee_name: "Hammad Bagshaw", department_id: 8 },
  { employee_name: "Ernaline Danneil", department_id: 9 },
  { employee_name: "Dewie Tripett", department_id: 9 },
];

const dummySpending: {
  employee_id: number;
  spending_date: string;
  value: number;
}[] = [
    { employee_id: 1, spending_date: "2022-09-26", value: 2804257102.13 },
    { employee_id: 42, spending_date: "2023-01-05", value: 3930125427.96 },
    { employee_id: 40, spending_date: "2026-02-12", value: 9386773945.85 },
    { employee_id: 5, spending_date: "2022-12-15", value: 6918345254.79 },
    { employee_id: 47, spending_date: "2021-03-05", value: 8487290171.46 },
    { employee_id: 51, spending_date: "2019-08-16", value: 6554948379.47 },
    { employee_id: 41, spending_date: "2018-07-06", value: 9722019613.29 },
    { employee_id: 46, spending_date: "2023-10-31", value: 4667043859.04 },
    { employee_id: 12, spending_date: "2018-07-24", value: 8745695755.51 },
    { employee_id: 6, spending_date: "2026-03-25", value: 8661941061.87 },
    { employee_id: 34, spending_date: "2020-07-07", value: 4110421940.26 },
    { employee_id: 8, spending_date: "2023-12-20", value: 4574316067.64 },
    { employee_id: 3, spending_date: "2019-03-01", value: 6085083230.45 },
    { employee_id: 4, spending_date: "2023-04-23", value: 5415864912.86 },
    { employee_id: 51, spending_date: "2020-11-18", value: 788142649.32 },
    { employee_id: 55, spending_date: "2021-09-14", value: 4711654351.48 },
    { employee_id: 48, spending_date: "2018-09-19", value: 2388402962.77 },
    { employee_id: 49, spending_date: "2019-04-16", value: 5327106825.13 },
    { employee_id: 41, spending_date: "2025-04-28", value: 4749867090.52 },
    { employee_id: 43, spending_date: "2022-12-26", value: 6979325901.89 },
    { employee_id: 42, spending_date: "2025-02-02", value: 134479844.68 },
    { employee_id: 22, spending_date: "2018-07-30", value: 1008813066.42 },
    { employee_id: 27, spending_date: "2023-12-29", value: 2413379759.88 },
    { employee_id: 22, spending_date: "2023-05-05", value: 7545445868.55 },
    { employee_id: 31, spending_date: "2020-07-29", value: 2595487292.09 },
    { employee_id: 14, spending_date: "2025-07-22", value: 6921757967.56 },
    { employee_id: 28, spending_date: "2023-10-27", value: 5279413047.17 },
    { employee_id: 52, spending_date: "2022-08-01", value: 3590836932.39 },
    { employee_id: 26, spending_date: "2023-05-07", value: 6098674096.25 },
    { employee_id: 35, spending_date: "2019-08-14", value: 3523406497.86 },
    { employee_id: 39, spending_date: "2021-02-05", value: 5556554522.6 },
    { employee_id: 34, spending_date: "2024-01-27", value: 7451813819.13 },
    { employee_id: 36, spending_date: "2024-11-17", value: 2448440104.14 },
    { employee_id: 38, spending_date: "2023-12-18", value: 607296808.97 },
    { employee_id: 21, spending_date: "2019-03-18", value: 411057325.66 },
    { employee_id: 49, spending_date: "2021-08-03", value: 1491896534.1 },
    { employee_id: 17, spending_date: "2023-01-07", value: 5922696940.34 },
    { employee_id: 48, spending_date: "2026-02-05", value: 8377022602.02 },
    { employee_id: 37, spending_date: "2023-03-09", value: 6785751803.39 },
    { employee_id: 45, spending_date: "2019-10-27", value: 902260414.68 },
    { employee_id: 29, spending_date: "2019-04-24", value: 9316076742.06 },
    { employee_id: 3, spending_date: "2022-08-15", value: 5265838385.2 },
    { employee_id: 3, spending_date: "2021-07-14", value: 6089449139.06 },
    { employee_id: 43, spending_date: "2024-03-16", value: 1185171904.63 },
    { employee_id: 19, spending_date: "2018-03-03", value: 7875725999.51 },
    { employee_id: 50, spending_date: "2019-07-26", value: 7382951977.83 },
    { employee_id: 9, spending_date: "2021-02-14", value: 3063748046.63 },
    { employee_id: 8, spending_date: "2022-10-09", value: 9804292341.55 },
    { employee_id: 16, spending_date: "2021-05-12", value: 6907397827.37 },
    { employee_id: 51, spending_date: "2025-07-23", value: 4079378357.5 },
    { employee_id: 37, spending_date: "2017-08-02", value: 4117453007.73 },
    { employee_id: 33, spending_date: "2020-04-24", value: 4405902629.9 },
    { employee_id: 53, spending_date: "2023-05-02", value: 785101369.21 },
    { employee_id: 50, spending_date: "2021-10-21", value: 6759045167.82 },
    { employee_id: 16, spending_date: "2025-08-27", value: 5463278607.28 },
    { employee_id: 42, spending_date: "2024-10-13", value: 8394854293.79 },
    { employee_id: 39, spending_date: "2024-10-23", value: 5721292673.23 },
    { employee_id: 2, spending_date: "2018-10-29", value: 1685547825.78 },
    { employee_id: 17, spending_date: "2025-08-05", value: 5366236774.95 },
    { employee_id: 27, spending_date: "2020-12-03", value: 7944535711.13 },
    { employee_id: 26, spending_date: "2017-08-17", value: 5482976325.32 },
    { employee_id: 1, spending_date: "2021-10-29", value: 5723133280.74 },
    { employee_id: 48, spending_date: "2024-01-25", value: 3032159155.77 },
    { employee_id: 15, spending_date: "2017-07-07", value: 5856341740.38 },
    { employee_id: 3, spending_date: "2023-04-10", value: 1307360627.7 },
    { employee_id: 50, spending_date: "2020-07-05", value: 1717792507.76 },
    { employee_id: 54, spending_date: "2021-08-07", value: 6785603530.97 },
    { employee_id: 50, spending_date: "2021-06-01", value: 3824126795.71 },
    { employee_id: 25, spending_date: "2018-01-18", value: 1844663255.5 },
    { employee_id: 54, spending_date: "2020-01-16", value: 2996766920.6 },
    { employee_id: 46, spending_date: "2025-11-07", value: 863248654.47 },
    { employee_id: 18, spending_date: "2018-05-02", value: 2716102750.31 },
    { employee_id: 39, spending_date: "2022-11-21", value: 8221627463.94 },
    { employee_id: 24, spending_date: "2025-11-20", value: 5536803621.31 },
    { employee_id: 52, spending_date: "2018-05-11", value: 4599503596.49 },
    { employee_id: 6, spending_date: "2020-06-04", value: 6651708986.28 },
    { employee_id: 7, spending_date: "2023-01-16", value: 865572308.45 },
    { employee_id: 10, spending_date: "2018-10-14", value: 5950705633.93 },
    { employee_id: 34, spending_date: "2022-12-11", value: 3892046863.97 },
    { employee_id: 28, spending_date: "2021-03-16", value: 2640647386.9 },
    { employee_id: 5, spending_date: "2026-03-29", value: 3316558598.55 },
    { employee_id: 49, spending_date: "2026-04-22", value: 4223981107.56 },
    { employee_id: 36, spending_date: "2018-04-25", value: 6507613828.15 },
    { employee_id: 53, spending_date: "2021-02-02", value: 4215733824.47 },
    { employee_id: 26, spending_date: "2021-06-01", value: 1472105608.77 },
    { employee_id: 24, spending_date: "2022-07-02", value: 8975316027.62 },
    { employee_id: 50, spending_date: "2024-09-09", value: 1445640150.64 },
    { employee_id: 27, spending_date: "2019-09-27", value: 2730011176.23 },
    { employee_id: 32, spending_date: "2023-06-25", value: 2214457002.44 },
    { employee_id: 12, spending_date: "2023-05-16", value: 1975121704.61 },
    { employee_id: 29, spending_date: "2025-01-06", value: 5837553555.17 },
    { employee_id: 28, spending_date: "2021-09-09", value: 9669329765.14 },
    { employee_id: 39, spending_date: "2021-12-07", value: 1320471219.64 },
    { employee_id: 1, spending_date: "2025-01-27", value: 961672635.78 },
    { employee_id: 1, spending_date: "2024-02-07", value: 7785722427.27 },
    { employee_id: 55, spending_date: "2022-04-21", value: 2359549720.55 },
    { employee_id: 21, spending_date: "2026-04-12", value: 6625693491.83 },
    { employee_id: 4, spending_date: "2022-11-25", value: 3190547609.45 },
    { employee_id: 19, spending_date: "2019-02-14", value: 4391775999.73 },
    { employee_id: 44, spending_date: "2025-10-05", value: 5876868914.56 },
    { employee_id: 32, spending_date: "2018-07-08", value: 3707050752.07 },
    { employee_id: 45, spending_date: "2019-02-03", value: 4965744441.58 },
    { employee_id: 50, spending_date: "2018-01-25", value: 2382379636.71 },
    { employee_id: 15, spending_date: "2021-09-08", value: 6901805463.21 },
    { employee_id: 6, spending_date: "2022-07-14", value: 2627625382.9 },
    { employee_id: 12, spending_date: "2020-11-08", value: 1204540280.48 },
    { employee_id: 54, spending_date: "2024-02-25", value: 2563232390.25 },
    { employee_id: 15, spending_date: "2023-12-29", value: 5315091263.82 },
    { employee_id: 18, spending_date: "2017-06-20", value: 6822305477.05 },
    { employee_id: 2, spending_date: "2025-12-30", value: 3261107632.79 },
    { employee_id: 17, spending_date: "2024-01-04", value: 5533315229.64 },
    { employee_id: 13, spending_date: "2019-06-21", value: 9948312083.4 },
    { employee_id: 29, spending_date: "2023-08-27", value: 5776269797.54 },
    { employee_id: 34, spending_date: "2018-07-30", value: 217340056.9 },
    { employee_id: 1, spending_date: "2022-10-24", value: 3856287792.22 },
    { employee_id: 33, spending_date: "2025-08-15", value: 3884122530.14 },
    { employee_id: 4, spending_date: "2022-03-10", value: 7178283325.11 },
    { employee_id: 5, spending_date: "2018-06-04", value: 3209516341.71 },
    { employee_id: 50, spending_date: "2025-07-29", value: 5958551731.71 },
    { employee_id: 32, spending_date: "2018-03-13", value: 3204028256.87 },
    { employee_id: 28, spending_date: "2018-05-24", value: 5547347822.85 },
    { employee_id: 17, spending_date: "2022-11-29", value: 5686848397.44 },
    { employee_id: 42, spending_date: "2018-11-15", value: 8820200160.46 },
    { employee_id: 53, spending_date: "2024-08-09", value: 5714794185.17 },
    { employee_id: 16, spending_date: "2017-07-12", value: 5907922009.04 },
    { employee_id: 8, spending_date: "2018-03-21", value: 371148536.48 },
    { employee_id: 2, spending_date: "2019-04-21", value: 7309943286.67 },
    { employee_id: 1, spending_date: "2021-03-22", value: 6044477157.34 },
    { employee_id: 44, spending_date: "2025-02-05", value: 7880851092.72 },
    { employee_id: 37, spending_date: "2024-01-11", value: 8418134432.24 },
    { employee_id: 46, spending_date: "2024-06-07", value: 7992739797.72 },
    { employee_id: 45, spending_date: "2022-08-04", value: 5616350878.89 },
    { employee_id: 45, spending_date: "2022-02-17", value: 842268473.52 },
    { employee_id: 18, spending_date: "2023-10-30", value: 5758645808.29 },
    { employee_id: 40, spending_date: "2020-05-31", value: 6202508649.86 },
    { employee_id: 30, spending_date: "2019-08-12", value: 5501580241.17 },
    { employee_id: 15, spending_date: "2020-10-17", value: 5022128959.42 },
    { employee_id: 18, spending_date: "2018-07-15", value: 5777067688.86 },
    { employee_id: 31, spending_date: "2018-12-11", value: 3792636858.29 },
    { employee_id: 21, spending_date: "2021-02-17", value: 9059127635.73 },
    { employee_id: 5, spending_date: "2023-12-23", value: 4308351281.88 },
    { employee_id: 50, spending_date: "2023-11-04", value: 9231146214.33 },
    { employee_id: 35, spending_date: "2022-10-03", value: 1499181176.13 },
    { employee_id: 38, spending_date: "2021-12-09", value: 9850676564.16 },
    { employee_id: 36, spending_date: "2021-12-20", value: 5840449240.24 },
    { employee_id: 38, spending_date: "2022-02-05", value: 4714117990.11 },
    { employee_id: 4, spending_date: "2019-02-09", value: 2970867485.01 },
    { employee_id: 20, spending_date: "2017-10-25", value: 3179539765.51 },
    { employee_id: 42, spending_date: "2021-04-12", value: 6915503973.13 },
    { employee_id: 19, spending_date: "2024-01-21", value: 5267686484.46 },
    { employee_id: 21, spending_date: "2023-06-23", value: 6083539682.63 },
    { employee_id: 16, spending_date: "2023-04-05", value: 3639321960.42 },
    { employee_id: 39, spending_date: "2019-07-23", value: 3840592803.89 },
  ];

async function seedDB() {
  db.connect();

  const depPlaceholder = dummyDepartmentsName
    .map((_, i) => {
      return `($${i + 1})`;
    })
    .join(",");

  const depResult = await db.query(
    `INSERT INTO departments(department_name)
    VALUES ${depPlaceholder}
    `,
    dummyDepartmentsName,
  );

  console.log(depResult && "[departments] table seeded");

  const empPlaceholder = dummyEmployees
    .map((_, i) => {
      const offset = i * 2;
      return `($${offset + 1}, $${offset + 2})`;
    })
    .join(",");

  const empValues = dummyEmployees.flatMap((emp) => [
    emp.employee_name,
    emp.department_id,
  ]);

  const empResult = await db.query(
    `INSERT INTO employees(employee_name, department_id)
    VALUES ${empPlaceholder}
    `,
    empValues,
  );

  console.log(empResult && "[employees] table seeded");

  const spenPlaceholder = dummySpending
    .map((_, i) => {
      const offset = i * 3;
      return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
    })
    .join(",");

  const spenValues = dummySpending.flatMap((spen) => [
    spen.employee_id,
    spen.spending_date,
    spen.value,
  ]);

  const spenResult = await db.query(
    `INSERT INTO spendings(employee_id, spending_date, value)
    VALUES ${spenPlaceholder}
    `,
    spenValues,
  );

  console.log(spenResult && "[spendings] table seeded");

  db.end();
}

seedDB();
