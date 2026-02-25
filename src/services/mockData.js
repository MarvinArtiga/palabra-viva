export const mockTodayReading = {
  date: '2026-02-23',
  liturgicalName: 'Tiempo Ordinario',
  liturgicalTitle: 'Catedra de San Pedro',
  liturgicalColor: 'verde', // TODO: Conectar color liturgico real desde JSON/backoffice.
  gospel: {
    reference: 'Mt 16, 13-19',
    title: 'Tu eres Pedro',
    excerpt:
      'En aquel tiempo, Jesus pregunto a sus discipulos: Quien dicen ustedes que soy yo?',
    text:
      'En aquel tiempo, al llegar a la region de Cesarea de Filipo, Jesus pregunto a sus discipulos: Quien dice la gente que es el Hijo del hombre? Ellos contestaron: Unos dicen que Juan el Bautista; otros, que Elias; otros, que Jeremias o alguno de los profetas. El les pregunto: Y ustedes, quien dicen que soy yo? Simon Pedro respondio: Tu eres el Mesias, el Hijo de Dios vivo.'
  },
  firstReading: {
    reference: '1 Pe 5, 1-4',
    title: 'Apacienten el rebano de Dios',
    text:
      'Queridos hermanos: A los presbiteros en esa comunidad, yo, presbitero como ellos y testigo de los sufrimientos de Cristo, les exhorto: Apacienten el rebano de Dios que se les ha confiado.'
  },
  psalm: {
    reference: 'Sal 22',
    title: 'El Senor es mi pastor',
    text: 'El Senor es mi pastor, nada me falta. En verdes praderas me hace recostar.'
  },
  secondReading: null
};

export const mockMonthReadings = {
  month: '2026-02',
  days: [
    {
      ...mockTodayReading,
      date: '2026-02-23'
    },
    {
      ...mockTodayReading,
      date: '2026-02-24',
      liturgicalTitle: 'Martes de la VII semana',
      gospel: {
        reference: 'Mc 9, 30-37',
        title: 'El mas grande es el servidor',
        excerpt: 'Si alguno quiere ser el primero, que sea el ultimo de todos.',
        text:
          'En aquel tiempo, Jesus instruia a sus discipulos y les decia: El Hijo del hombre va a ser entregado. Si alguno quiere ser el primero, que sea el ultimo de todos y el servidor de todos.'
      }
    }
  ]
};

export const mockArchiveMonths = [
  { month: '2026-02', label: 'Febrero 2026' },
  { month: '2026-01', label: 'Enero 2026' },
  { month: '2025-12', label: 'Diciembre 2025' }
];
