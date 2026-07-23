# SPECS del Dashboard

Necesito que me construyas un componente React + TypeScript llamado Dashboard.tsx. Que utilice la dependencia de Recharts.

Dicho componente debe tener un array con objetos con toda la data necesaria para hacer un gráfico el gráfico de Recharts.

Las variables (o sea la data), son:

- Producción Lisa (número de envases sin decorar)
- Envases decorados (o sea el número de envases decorados)
- Envases con defectos (el número de envases sin decorar)

Ahora bien, el componente Dashboard será solo el padre del componente que trabaje el gráfico. O sea, el componente Dashboard.tsx debe tener un input de fecha (para el timeline), un select para cambiar el tipo de gráfico (por ahora solo 3: el lineal, de barras y de torta) y el llamado al componente que hará de gráfico (o sea, Lineal.tsx, Barras.tsx o Torta.tsx).

O sea, lo que busco es un dashboard que me sirva para ver los datos en un determinado periodo de tiempo. Que se yo. Ultimos 3 meses, ultimas 5 semanas, o desde 20 de enero de 2026 al 20 de febrero de 2026. Y el grafico me tiene que mostrar toda la data en dicho periodo. Obviamente el array con la data es solo para hacer las pruebas, porque la idea es consumir mas adelante la API de mi backend que obtenga la informacion desde la BBDD, pero por ahora el array nos sirve. Y si me da la gana, puedo desactivar (ocultar) tal variable para no tener que verla y solo concentrarme en las otras.

Mas o menos el directorio Dashboard deberia verse asi:

Dashboard/

- index.tsx
- Dashboard.module.css
- Graficos/
  - Lineal/
    - index.tsx
    - Lineal.module.css
  - Barras/
    - index.tsx
    - Barras.module.css
  - Torta/
    - index.tsx
    - Torta.module.css

Por supuesto, haz todo lo más simple posible, mientras menos complejo sea mejor
