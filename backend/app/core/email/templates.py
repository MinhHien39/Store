"""
Email templates
Loads HTML templates from files and injects variables
"""
import os
from typing import Optional
from app.core import DateUtils

# Template files directory
_TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "html")


def _read_template(filename: str) -> str:
    """テンプレートファイルを読み込む"""
    filepath = os.path.join(_TEMPLATE_DIR, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        return f.read().strip()


class EmailTemplate:
    """メールテンプレートクラス"""

    # ------------------------------------------------------------------
    # Verification Email
    # ------------------------------------------------------------------

    @staticmethod
    def get_verification_email_html(
        verification_code: str,
        user_name: Optional[str] = None,
        role_name: str = "ユーザー"
    ) -> str:
        greeting = f"、{user_name}様" if user_name else ""
        current_year = DateUtils.now().year

        return _read_template("verification_email.html").format(
            greeting=greeting,
            role_name=role_name,
            verification_code=verification_code,
            current_year=current_year,
        )

    # ------------------------------------------------------------------
    # Password Reset Email
    # ------------------------------------------------------------------

    @staticmethod
    def get_password_reset_email_html(
        reset_password_url: str,
        user_name: Optional[str] = None
    ) -> str:
        greeting = f"、{user_name}様" if user_name else ""
        current_year = DateUtils.now().year

        return _read_template("password_reset.html").format(
            greeting=greeting,
            reset_password_url=reset_password_url,
            current_year=current_year,
        )

    # ------------------------------------------------------------------
    # Invitation Verify Success Page
    # ------------------------------------------------------------------

    @staticmethod
    def get_invitation_verify_success_html(
        redirect_url: str,
    ) -> str:
        current_year = str(DateUtils.now().year)
        # CSS/JS の {} と衝突するため str.replace() を使用
        html = _read_template("invitation_verify_success.html")
        html = html.replace("{redirect_url}", redirect_url)
        html = html.replace("{current_year}", current_year)
        return html
