# Gestión de Estado

Masterpiece utiliza **Zustand** para la gestión global del estado de la aplicación. Esto permite un manejo eficiente y sencillo del estado compartido entre componentes, evitando la complejidad de soluciones más pesadas como Redux.

- La carpeta `src/store/` contiene los stores de Zustand, donde se define el estado global y las acciones para modificarlo.
- Los componentes consumen el estado global mediante hooks personalizados provistos por Zustand.
- El enfoque actual es centralizar la lógica de estado y facilitar la integración con hooks y componentes Material UI.

Esta aproximación facilita la escalabilidad y el mantenimiento del estado en aplicaciones React modernas.
