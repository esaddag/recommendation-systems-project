import numpy as np
import pandas as pd
import difflib


film = pd.read_csv("data/movie.csv")
oylama = pd.read_csv("data/rating.csv")
df = film.merge(oylama, how="left", on="movieId")
film_yorum_sayilari = pd.DataFrame(df["title"].value_counts())
# isin fonksiyonu bir dataframe içinden istenilen özellikteki row ları seçmeye yarıyor.
# burada yorum sayısı 1000'den fazla olan filmler seçiliyor.
populer_filmler = df[df["title"].isin(film_yorum_sayilari[film_yorum_sayilari["title"] > 10000].index)]
#print(film_yorum_sayilari[film_yorum_sayilari["title"] > 10000].shape)
kullanici_film_matrisi = populer_filmler.pivot_table(index=["userId"], columns=["title"], values="rating")



def urun_bazli_filtreleme(film_adi):
    #burada yapılan arama kelimesine göre en az %30 olmak üzere en iyi eşleşen 5 film alınıyor.
    film_adlari=difflib.get_close_matches(film_adi,populer_filmler["title"].astype(str).values.tolist(), n=5, cutoff=.3)
    film_adi = kullanici_film_matrisi[film_adlari[0]]
    return kullanici_film_matrisi.corrwith(film_adi).sort_values(ascending=False).head(10)


#print(urun_bazli_filtreleme("Matrix "))

def kullanici_bazli_filtreleme(kullaniciId):
    random_kullanici_df = kullanici_film_matrisi[kullanici_film_matrisi.index == kullaniciId]

    #kullanici tarafından izlenen filmlerin dataframe i oluşturuluyor
    izlenen_filmler = random_kullanici_df.columns[random_kullanici_df.notna().any()].tolist()

    izlenen_filmler_df = kullanici_film_matrisi[izlenen_filmler]

    kullanici_film_sayisi = izlenen_filmler_df.T.notnull().sum()
    kullanici_film_sayisi = kullanici_film_sayisi.reset_index()
    kullanici_film_sayisi.columns = ["userId","movie_count"]

    oran = len(izlenen_filmler) * 60 / 100

    kullanici_ayni_filmler = kullanici_film_sayisi[kullanici_film_sayisi["movie_count"] > oran]["userId"]
    kullanici_ayni_filmler.count()

    son_df = pd.concat([izlenen_filmler_df[izlenen_filmler_df.index.isin(kullanici_ayni_filmler)], random_kullanici_df[izlenen_filmler]])

    #kullanicilar arasında korelasyon
    corr_df = son_df.T.corr().unstack().sort_values().drop_duplicates()
    corr_df = pd.DataFrame(corr_df, columns=["corr"])
    corr_df.index.names = ['user_id_1', 'user_id_2']
    corr_df = corr_df.reset_index()

    # yalnizca %70 üzerinde eşleşen kullaniciları al
    en_iyi_eslesen_kullanicilar = corr_df[(corr_df["user_id_1"] == kullaniciId) & (corr_df["corr"] >= 0.70)][
        ["user_id_2", "corr"]].reset_index(drop=True)
    en_iyi_eslesen_kullanicilar = en_iyi_eslesen_kullanicilar.sort_values(by='corr', ascending=False)
    en_iyi_eslesen_kullanicilar.rename(columns={"user_id_2": "userId"}, inplace=True)

    en_iyi_eslesen_kullanici_oylari = en_iyi_eslesen_kullanicilar.merge(oylama[["userId", "movieId", "rating"]], how='inner')
    en_iyi_eslesen_kullanici_oylari = en_iyi_eslesen_kullanici_oylari[en_iyi_eslesen_kullanici_oylari["userId"] != kullaniciId]



    en_iyi_eslesen_kullanici_oylari['weighted_rating'] = en_iyi_eslesen_kullanici_oylari['corr'] * en_iyi_eslesen_kullanici_oylari['rating']
    en_iyi_eslesen_kullanici_oylari.groupby('movieId').agg({"weighted_rating": "mean"})


    onerilen_df = en_iyi_eslesen_kullanici_oylari.groupby('movieId').agg({"weighted_rating": "mean"})
    onerilen_df = onerilen_df.reset_index()
    onerilen_df = onerilen_df.sort_values("weighted_rating", ascending=False)
    return onerilen_df.merge(film[["movieId", "title"]])[:10]['title'].to_list()

#random_kullaniciId = int(pd.Series(kullanici_film_matrisi.index).sample(1, random_state=45).values)
#print(random_kullaniciId)
#print(kullanici_bazli_filtreleme(random_kullaniciId))