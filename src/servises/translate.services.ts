import trh from "../db/trh";

class TranslateService {
  async getAllKeysByTbl(tbl: string) {
    try {
      const result = await trh.query(
        `select t.*, b.expr 
          from (select a.keystr, count(*) as kilperekl 
          from translation a 
          where a.tbl = $1 
          group by a.keystr 
          order by keystr) t 
          left join translation b on b.tbl = $1 
            and b.lang = 'uk' 
            and b.keystr = t.keystr`,
        [tbl]
      );
      return result.rows;
    } catch (error) {
      console.error("DB error: ", error);
      throw new Error("Error feching-keys translate");
    }
  }

  async allFields(value: string) {
    try {
      const result = await trh.query(
        "select * from translation where keystr = $1",
        [value]
      );
      return result.rows[0];
    } catch (error) {
      console.error("DB error: ", error);
    }
  }

  async allTranslate(key: string, tbl: string) {
    try {
      const result = await trh.query(
        `select a.ids, b.expr 
              from v_langint a 
                left join translation b on b.lang  = a.ids 
                and b.tbl = $2 
                and b.keystr = $1`,
        [key, tbl]
      );
      return result.rows;
    } catch (error) {
      console.error("DB error: ", error);
      throw new Error("Error feching-keys translate");
    }
  }

  async filteredKeys(filters: { id: string; value: string }[], tbl: string) {
    const conditions: string[] = [];
    const values: string[] = [];
    try {
      filters.forEach(({ id, value }, index) => {
        conditions.push(`cast(${id} as text) ilike $${index + 1}`);
        values.push(`%${value}%`);
      });

      if (tbl) {
        values.push(tbl);
        conditions.push(`tbl = $${values.length}`);
      }
      const where = conditions.length
        ? `where ${conditions.join(" and ")}`
        : "";
      const result = await trh.query(
        `select * from translation ${where}`,
        values
      );
      return result.rows;
    } catch (error: any) {
      console.error("DB error:", error);
      throw new Error("Error filtered keys");
    }
  }

  async tarasProcedura(procObj: {
    id_admuser: number;
    tbl: string;
    fld: string;
    keystr: string;
    lang: string;
    expr: string;
    oper: number;
  }) {
    try {
      const procString = JSON.stringify({
        ...procObj,
        function_name: "adm_translation_modify",
      });
      const result = await trh.query("call adm_run($1, $2)", [procString, {}]);
      return result.rows[0].rs;
    } catch (error: any) {
      console.error("DB error:", error);
      throw new Error("Error filtered keys");
    }
  }

  async translDelete(procObj: {
    id_admuser: number;
    tbl: string;
    fld: string;
    keystr: string;
    lang: string;
    expr: string;
    oper: number;
  }) {
    try {
      const procString = JSON.stringify(procObj);
      const result = await trh.query("call adm_translation_modify($1, $2)", [
        procString,
        {},
      ]);
      return result.rows[0];
    } catch (error: any) {
      console.error("DB error:", error);
      throw new Error("Error filtered keys");
    }
  }

  async translForMoreFields() {
    try {
      const result = await trh.query(
        `select tbl, 
                case when tbl = 'appterm' then 'Інтерфейс' 
                  when tbl = 'country' then 'Країни' 
                  when tbl = 'err' then 'Помилки' 
                  when tbl = 'education' then 'Види освіт' 
                  when tbl = 'menu_group' then 'Групи меню' 
                  when tbl = 'menu_item' then 'Пункти меню' 
                  when tbl = 'trailer_group' then 'Групи причепів' 
                  when tbl = 'trailer_type' then 'Види причепів' 
                  when tbl = 'valut' then 'Валюти' 
                end as name 
         from (select distinct tbl from translation) t 
         order by name`
      );
      return result.rows;
    } catch (error: any) {
      console.error("DB error:", error);
      throw new Error("Error translate for more fields");
    }
  }
}

export const translateService = new TranslateService();
