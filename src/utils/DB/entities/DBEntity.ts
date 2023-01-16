export default abstract class DBEntity<
  Entity extends { id: string },
  ChangeDTO,
  CreateDTO
> {
  protected entities: Entity[] = [];

  abstract create(createDto: CreateDTO): Promise<Entity>;

  async findOne(id: string): Promise<Entity | null> {
    return this.entities.find((o) => o.id === id) ?? null;
  }

  async findMany(ids: string[]): Promise<(Entity | null)[]>;
  async findMany(): Promise<Entity[]>;
  async findMany(ids?: string[]): Promise<Entity[] | (Entity | null)[]> {
    if (ids) {
      const result = new Array(ids.length).fill(null) as (Entity | null)[];
      for (let i = 0; i < this.entities.length; i++) {
        const idxResult = ids.indexOf(this.entities[i].id);
        if (idxResult !== -1) {
          result[idxResult] = this.entities[i];
          if (!result.includes(null)) break;
        }
      }
      return result;
    }
    return this.entities;
  }

  async delete(id: string): Promise<Entity | null> {
    const idx = this.entities.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    const deleted = this.entities[idx];
    this.entities.splice(idx, 1);
    return deleted;
  }

  async change(id: string, changeDTO: ChangeDTO): Promise<Entity | null> {
    const idx = this.entities.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    const changed = { ...this.entities[idx], ...changeDTO };
    this.entities.splice(idx, 1, changed);
    return changed;
  }
}
