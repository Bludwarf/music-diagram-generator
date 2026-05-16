export interface ModelDtoMapper<M, D> {
    dto(model: M): D;

    model(dto: D): M;
}
